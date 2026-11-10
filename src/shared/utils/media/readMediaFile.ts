export function readMediaFile(file: File | null | undefined, allowVideo = false): Promise<string> {
  if (!file) return Promise.resolve('')
  const image = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  const video = allowVideo && ['video/mp4', 'video/webm'].includes(file.type)
  if ((!image && !video) || file.size > 280_000) {
    return Promise.reject(
      new Error(
        allowVideo
          ? '지원하는 사진 또는 MP4·WebM 영상을 280 KB 이하로 선택해 주세요.'
          : 'PNG, JPG 또는 WEBP 이미지를 280 KB 이하로 선택해 주세요.'
      )
    )
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('파일을 읽을 수 없습니다.'))
    reader.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
    reader.readAsDataURL(file)
  })
}
