const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const TILE_GRIDS_DIR = path.join(__dirname, '../src/assets/grids_background/Tile_grids_background');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/grids_background/Tile_grids_background');

// Tamanhos dos slots por tipo
const SLOT_SIZES = {
  city: {
    mobile: { width: 80, height: 96 },
    desktop: { width: 96, height: 112 }
  },
  farm: {
    mobile: { width: 80, height: 96 },
    desktop: { width: 96, height: 112 }
  },
  landmark: {
    mobile: { width: 96, height: 128 },
    desktop: { width: 112, height: 160 }
  },
  event: {
    mobile: { width: 96, height: 128 },
    desktop: { width: 112, height: 160 }
  }
};

// Função para converter SVG para PNG com tamanho específico
async function convertTileGrid(svgPath, outputPath, width, height, filename) {
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
  console.log('🎨 Iniciando conversão dos tiles dos grids...\n');
  
  try {
    // Verificar se o diretório de saída existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Converter cada tile grid
    const conversions = [
      {
        svgFile: 'City_grid.svg',
        name: 'City Grid Tile',
        sizes: SLOT_SIZES.city
      },
      {
        svgFile: 'Farm_grid.svg',
        name: 'Farm Grid Tile',
        sizes: SLOT_SIZES.farm
      },
      {
        svgFile: 'Landmark_grid.svg',
        name: 'Landmark Grid Tile',
        sizes: SLOT_SIZES.landmark
      },
      {
        svgFile: 'Event_grid.svg',
        name: 'Event Grid Tile',
        sizes: SLOT_SIZES.event
      }
    ];
    
    for (const conversion of conversions) {
      const svgPath = path.join(TILE_GRIDS_DIR, conversion.svgFile);
      const baseName = path.parse(conversion.svgFile).name;
      
      if (fs.existsSync(svgPath)) {
        // Converter para mobile
        const mobileOutputPath = path.join(OUTPUT_DIR, `${baseName}_mobile.png`);
        await convertTileGrid(
          svgPath,
          mobileOutputPath,
          conversion.sizes.mobile.width,
          conversion.sizes.mobile.height,
          `${conversion.name} (Mobile)`
        );
        
        // Converter para desktop
        const desktopOutputPath = path.join(OUTPUT_DIR, `${baseName}_desktop.png`);
        await convertTileGrid(
          svgPath,
          desktopOutputPath,
          conversion.sizes.desktop.width,
          conversion.sizes.desktop.height,
          `${conversion.name} (Desktop)`
        );
      } else {
        console.log(`⚠️ Arquivo não encontrado: ${conversion.svgFile}`);
      }
    }
    
    console.log('\n🎉 Conversão dos tiles concluída com sucesso!');
    console.log(`📁 Arquivos PNG criados em: ${OUTPUT_DIR}`);
    console.log('\n📏 Tamanhos criados:');
    console.log('🏙️ City Grid:');
    console.log(`   Mobile: ${SLOT_SIZES.city.mobile.width}x${SLOT_SIZES.city.mobile.height}px`);
    console.log(`   Desktop: ${SLOT_SIZES.city.desktop.width}x${SLOT_SIZES.city.desktop.height}px`);
    console.log('🌾 Farm Grid:');
    console.log(`   Mobile: ${SLOT_SIZES.farm.mobile.width}x${SLOT_SIZES.farm.mobile.height}px`);
    console.log(`   Desktop: ${SLOT_SIZES.farm.desktop.width}x${SLOT_SIZES.farm.desktop.height}px`);
    console.log('🏛️ Landmark Grid:');
    console.log(`   Mobile: ${SLOT_SIZES.landmark.mobile.width}x${SLOT_SIZES.landmark.mobile.height}px`);
    console.log(`   Desktop: ${SLOT_SIZES.landmark.desktop.width}x${SLOT_SIZES.landmark.desktop.height}px`);
    console.log('⚡ Event Grid:');
    console.log(`   Mobile: ${SLOT_SIZES.event.mobile.width}x${SLOT_SIZES.event.mobile.height}px`);
    console.log(`   Desktop: ${SLOT_SIZES.event.desktop.width}x${SLOT_SIZES.event.desktop.height}px`);
    
  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
  }
}

// Executar o script
main(); 