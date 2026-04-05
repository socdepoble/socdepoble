export function exportPlainBackup(data) {
  const text = JSON.stringify(data, null, 2)

  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'sdp_backup.txt'
  a.click()

  URL.revokeObjectURL(url)
}
