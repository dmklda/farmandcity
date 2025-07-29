const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const GRIDS_BACKGROUND_DIR = path.join(__dirname, '../src/assets/grids_background');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/grids_background');

// Tamanhos para os backgrounds dos grids
const GRID_SIZES = [400, 600, 800]; // Diferentes tamanhos para diferentes resoluções

// Função para converter SVG para PNG
async function convertGridBackground(svgPath, outputDir, filename, sizes = [600]) {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    for (const size of sizes) {
      const pngFilename = `${filename}_${size}x${size}.png`;
      const pngPath = path.join(outputDir, pngFilename);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Fundo transparente
        })
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Convertido: ${filename}.svg → ${pngFilename} (${size}x${size})`);
    }
  } catch (error) {
    console.error(`❌ Erro ao converter ${filename}:`, error.message);
  }
}

// Função principal
async function main() {
  console.log('🎨 Iniciando conversão dos backgrounds dos grids...\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(GRIDS_BACKGROUND_DIR);
    
    for (const file of files) {
      if (file.toLowerCase().endsWith('.svg')) {
        const filePath = path.join(GRIDS_BACKGROUND_DIR, file);
        const filename = path.parse(file).name;
        
        console.log(`🔄 Processando: ${file}`);
        await convertGridBackground(filePath, OUTPUT_DIR, filename, GRID_SIZES);
      }
    }
    
    console.log('\n🎉 Conversão dos grids concluída com sucesso!');
    console.log(`📁 Arquivos PNG criados em: ${OUTPUT_DIR}`);
    console.log(`📏 Tamanhos criados: ${GRID_SIZES.join('x, ')}x`);
    
  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
  }
}

// Executar o script
main(); 