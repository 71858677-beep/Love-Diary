export function useImageUpload() {
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('video/')) {
        fileToBase64(file).then(resolve).catch(reject)
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) { reject(new Error('Canvas context failed')); return }
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = reject
        img.src = reader.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function openFilePicker(accept = 'image/*,video/*'): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = accept
      input.onchange = () => {
        const file = input.files?.[0] || null
        resolve(file)
      }
      input.click()
    })
  }

  return { fileToBase64, compressImage, openFilePicker }
}
