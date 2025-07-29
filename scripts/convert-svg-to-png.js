const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configurações
const ICONS_DIR = path.join(__dirname, '../src/assets/icons');
const SIZES = [16, 24, 32, 48, 64, 128, 256, 512]; // Tamanhos diferentes para diferentes usos

// Função para converter SVG para PNG
async function convertSvgToPng(svgPath, outputDir, filename, sizes = [32]) {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    for (const size of sizes) {
      const pngFilename = `${filename}_${size}x${size}.png`;
      const pngPath = path.join(outputDir, pngFilename);
      
      // Adicionar padding para preservar elementos que se estendem além do centro
      const padding = Math.floor(size * 0.2); // 20% de padding
      const finalSize = size + (padding * 2);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Fundo transparente
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Convertido: ${filename} → ${pngFilename} (${size}x${size})`);
    }
  } catch (error) {
    console.error(`❌ Erro ao converter ${filename}:`, error.message);
  }
}

// Função para processar um diretório
async function processDirectory(dirPath, outputDir, sizes = [32]) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Processar subdiretório
      const subOutputDir = path.join(outputDir, file);
      await processDirectory(filePath, subOutputDir, sizes);
    } else if (file.toLowerCase().endsWith('.svg')) {
      // Converter arquivo SVG
      const filename = path.parse(file).name;
      await convertSvgToPng(filePath, outputDir, filename, sizes);
    }
  }
}

// Função principal
async function main() {
  console.log('🎨 Iniciando conversão de SVG para PNG...\n');
  
  try {
    // Processar diretório principal
    await processDirectory(ICONS_DIR, ICONS_DIR, SIZES);
    
    console.log('\n🎉 Conversão concluída com sucesso!');
    console.log(`📁 Arquivos PNG criados em: ${ICONS_DIR}`);
    console.log(`📏 Tamanhos criados: ${SIZES.join('x, ')}x`);
    
  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
  }
}

// Executar o script
main(); 