// 用 macOS 自带词典查英语单词的发音标注，输出「词<TAB>词条开头」。只在 macOS 上运行。
// 用法：swiftc -O scripts/en-lookup.swift -o /tmp/en-lookup && /tmp/en-lookup < 词表 > 结果
import Foundation
import CoreServices
var seen = Set<String>()
while let line = readLine() {
  let cleaned = line.replacingOccurrences(of: "\\(.*?\\)", with: "", options: .regularExpression)
  for raw in cleaned.split(whereSeparator: { $0 == " " || $0 == "-" || $0 == "/" }) {
    let w = String(raw).trimmingCharacters(in: CharacterSet(charactersIn: ".,?!"))
    if w.isEmpty || seen.contains(w) { continue }
    seen.insert(w)
    let r = CFRangeMake(0, (w as NSString).length)
    let d = (DCSCopyTextDefinition(nil, w as CFString, r)?.takeRetainedValue() as String?) ?? ""
    print(w + "\t" + String(d.prefix(500)).replacingOccurrences(of: "\n", with: " "))
  }
}
