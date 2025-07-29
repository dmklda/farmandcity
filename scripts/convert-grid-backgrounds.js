const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const GRIDS_BACKGROUND_DIR = path.join(__dirname, '../src/assets/grids_background');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/grids_background');

// Tamanhos específicos dos containers dos grids
const GRID_SIZES = {
  city: { width: 344, height: 516 },
  farm: { width: 344, height: 516 },
  landmark: { width: 392, height: 192 },
  event: { width: 268, height: 192 }
};

// Função para converter SVG para PNG com tamanho específico
async function convertGridBackground(svgPath, outputPath, width, height, filename) {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    await sharp(svgBuffer)
      .resize(width, height, {
        fit: 'cover',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Convertido: ${filename} → ${path.basename(outputPath)} (${width}x${height})`);
  } catch (error) {
    console.error(`❌ Erro ao converter ${filename}:`, error.message);
  }
}

// Função principal
async function main() {
  console.log('🎨 Iniciando conversão dos backgrounds dos grids...\n');
  
  try {
    // Verificar se o diretório de saída existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Converter cada background
    const conversions = [
      {
        svgFile: 'City.svg',
        outputFile: 'City_background.png',
        size: GRID_SIZES.city,
        name: 'City Grid Background'
      },
      {
        svgFile: 'Farm.svg',
        outputFile: 'Farm_background.png',
        size: GRID_SIZES.farm,
        name: 'Farm Grid Background'
      },
      {
        svgFile: 'Landmark.svg',
        outputFile: 'Landmark_background.png',
        size: GRID_SIZES.landmark,
        name: 'Landmark Grid Background'
      },
      {
        svgFile: 'Events.svg',
        outputFile: 'Events_background.png',
        size: GRID_SIZES.event,
        name: 'Events Grid Background'
      }
    ];
    
    for (const conversion of conversions) {
      const svgPath = path.join(GRIDS_BACKGROUND_DIR, conversion.svgFile);
      const outputPath = path.join(OUTPUT_DIR, conversion.outputFile);
      
      if (fs.existsSync(svgPath)) {
        await convertGridBackground(
          svgPath,
          outputPath,
          conversion.size.width,
          conversion.size.height,
          conversion.name
        );
      } else {
        console.log(`⚠️ Arquivo não encontrado: ${conversion.svgFile}`);
      }
    }
    
    console.log('\n🎉 Conversão dos backgrounds concluída com sucesso!');
    console.log(`📁 Arquivos PNG criados em: ${OUTPUT_DIR}`);
    console.log('\n📏 Tamanhos criados:');
    console.log(`🏙️ City: ${GRID_SIZES.city.width}x${GRID_SIZES.city.height}px`);
    console.log(`🌾 Farm: ${GRID_SIZES.farm.width}x${GRID_SIZES.farm.height}px`);
    console.log(`🏛️ Landmark: ${GRID_SIZES.landmark.width}x${GRID_SIZES.landmark.height}px`);
    console.log(`⚡ Events: ${GRID_SIZES.event.width}x${GRID_SIZES.event.height}px`);
    
  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
  }
}

// Executar o script
main(); 