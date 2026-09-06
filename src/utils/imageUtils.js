/**
 * Redueix una imatge utilitzant Canvas i la torna com a DataURL.
 * Per defecte utilitza el format WebP amb compressió agressiva per a
 * maximitzar l'estalvi d'espai a la base de dades sense perdre qualitat.
 * 
 * @param {File} file L'arxiu d'imatge original
 * @param {Object} options Opcions de compressió
 * @param {number} options.maxSize Mida màxima en píxels de l'eix més llarg (600 per avatar/logo, 1200 per capçalera/hero)
 * @param {string} options.format Format d'eixida (per defecte: 'image/webp')
 * @param {number} options.quality Qualitat de compressió (de 0 a 1)
 * @returns {Promise<string>} Promesa que resol amb el DataURL (Base64)
 */
export function compressImage(file, { maxSize = 600, format = 'image/webp', quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Cap arxiu proporcionat'));

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fons transparent per si s'usa format PNG o similar
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL(format, quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
