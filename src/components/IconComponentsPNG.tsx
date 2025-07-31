import React from 'react';

// Importar todos os ícones PNG
// Recursos
import Coins16 from '../assets/icons/Coins_16x16.png';
import Coins24 from '../assets/icons/Coins_24x24.png';
import Coins32 from '../assets/icons/Coins_32x32.png';
import Coins48 from '../assets/icons/Coins_48x48.png';
import Coins64 from '../assets/icons/Coins_64x64.png';
import Coins128 from '../assets/icons/Coins_128x128.png';

import Foods16 from '../assets/icons/Foods_16x16.png';
import Foods24 from '../assets/icons/Foods_24x24.png';
import Foods32 from '../assets/icons/Foods_32x32.png';
import Foods48 from '../assets/icons/Foods_48x48.png';
import Foods64 from '../assets/icons/Foods_64x64.png';
import Foods128 from '../assets/icons/Foods_128x128.png';

import Materials16 from '../assets/icons/Materials_16x16.png';
import Materials24 from '../assets/icons/Materials_24x24.png';
import Materials32 from '../assets/icons/Materials_32x32.png';
import Materials48 from '../assets/icons/Materials_48x48.png';
import Materials64 from '../assets/icons/Materials_64x64.png';
import Materials128 from '../assets/icons/Materials_128x128.png';

import Population16 from '../assets/icons/Population_16x16.png';
import Population24 from '../assets/icons/Population_24x24.png';
import Population32 from '../assets/icons/Population_32x32.png';
import Population48 from '../assets/icons/Population_48x48.png';
import Population64 from '../assets/icons/Population_64x64.png';
import Population128 from '../assets/icons/Population_128x128.png';

// Tipos de Cartas
import Action16 from '../assets/icons/card_type_icon/action_16x16.png';
import Action24 from '../assets/icons/card_type_icon/action_24x24.png';
import Action32 from '../assets/icons/card_type_icon/action_32x32.png';
import Action48 from '../assets/icons/card_type_icon/action_48x48.png';
import Action64 from '../assets/icons/card_type_icon/action_64x64.png';
import Action128 from '../assets/icons/card_type_icon/action_128x128.png';

import City16 from '../assets/icons/card_type_icon/City_16x16.png';
import City24 from '../assets/icons/card_type_icon/City_24x24.png';
import City32 from '../assets/icons/card_type_icon/City_32x32.png';
import City48 from '../assets/icons/card_type_icon/City_48x48.png';
import City64 from '../assets/icons/card_type_icon/City_64x64.png';
import City128 from '../assets/icons/card_type_icon/City_128x128.png';

import Defense16 from '../assets/icons/card_type_icon/defense_16x16.png';
import Defense24 from '../assets/icons/card_type_icon/defense_24x24.png';
import Defense32 from '../assets/icons/card_type_icon/defense_32x32.png';
import Defense48 from '../assets/icons/card_type_icon/defense_48x48.png';
import Defense64 from '../assets/icons/card_type_icon/defense_64x64.png';
import Defense128 from '../assets/icons/card_type_icon/defense_128x128.png';

import Event16 from '../assets/icons/card_type_icon/event_16x16.png';
import Event24 from '../assets/icons/card_type_icon/event_24x24.png';
import Event32 from '../assets/icons/card_type_icon/event_32x32.png';
import Event48 from '../assets/icons/card_type_icon/event_48x48.png';
import Event64 from '../assets/icons/card_type_icon/event_64x64.png';
import Event128 from '../assets/icons/card_type_icon/event_128x128.png';

import Farm16 from '../assets/icons/card_type_icon/farm_16x16.png';
import Farm24 from '../assets/icons/card_type_icon/farm_24x24.png';
import Farm32 from '../assets/icons/card_type_icon/farm_32x32.png';
import Farm48 from '../assets/icons/card_type_icon/farm_48x48.png';
import Farm64 from '../assets/icons/card_type_icon/farm_64x64.png';
import Farm128 from '../assets/icons/card_type_icon/farm_128x128.png';

import Landmark16 from '../assets/icons/card_type_icon/landmark_16x16.png';
import Landmark24 from '../assets/icons/card_type_icon/landmark_24x24.png';
import Landmark32 from '../assets/icons/card_type_icon/landmark_32x32.png';
import Landmark48 from '../assets/icons/card_type_icon/landmark_48x48.png';
import Landmark64 from '../assets/icons/card_type_icon/landmark_64x64.png';
import Landmark128 from '../assets/icons/card_type_icon/landmark_128x128.png';

import Magic16 from '../assets/icons/card_type_icon/magic_16x16.png';
import Magic24 from '../assets/icons/card_type_icon/magic_24x24.png';
import Magic32 from '../assets/icons/card_type_icon/magic_32x32.png';
import Magic48 from '../assets/icons/card_type_icon/magic_48x48.png';
import Magic64 from '../assets/icons/card_type_icon/magic_64x64.png';
import Magic128 from '../assets/icons/card_type_icon/magic_128x128.png';

import Trap16 from '../assets/icons/card_type_icon/trap_16x16.png';
import Trap24 from '../assets/icons/card_type_icon/trap_24x24.png';
import Trap32 from '../assets/icons/card_type_icon/trap_32x32.png';
import Trap48 from '../assets/icons/card_type_icon/trap_48x48.png';
import Trap64 from '../assets/icons/card_type_icon/trap_64x64.png';
import Trap128 from '../assets/icons/card_type_icon/trap_128x128.png';

// Raridades
import Common16 from '../assets/icons/raridade/common_16x16.png';
import Common24 from '../assets/icons/raridade/common_24x24.png';
import Common32 from '../assets/icons/raridade/common_32x32.png';
import Common48 from '../assets/icons/raridade/common_48x48.png';
import Common64 from '../assets/icons/raridade/common_64x64.png';
import Common128 from '../assets/icons/raridade/common_128x128.png';

import Uncommon16 from '../assets/icons/raridade/uncommon_16x16.png';
import Uncommon24 from '../assets/icons/raridade/uncommon_24x24.png';
import Uncommon32 from '../assets/icons/raridade/uncommon_32x32.png';
import Uncommon48 from '../assets/icons/raridade/uncommon_48x48.png';
import Uncommon64 from '../assets/icons/raridade/uncommon_64x64.png';
import Uncommon128 from '../assets/icons/raridade/uncommon_128x128.png';

import Rare16 from '../assets/icons/raridade/rare_16x16.png';
import Rare24 from '../assets/icons/raridade/rare_24x24.png';
import Rare32 from '../assets/icons/raridade/rare_32x32.png';
import Rare48 from '../assets/icons/raridade/rare_48x48.png';
import Rare64 from '../assets/icons/raridade/rare_64x64.png';
import Rare128 from '../assets/icons/raridade/rare_128x128.png';

import Legendary16 from '../assets/icons/raridade/legendary_16x16.png';
import Legendary24 from '../assets/icons/raridade/legendary_24x24.png';
import Legendary32 from '../assets/icons/raridade/legendary_32x32.png';
import Legendary48 from '../assets/icons/raridade/legendary_48x48.png';
import Legendary64 from '../assets/icons/raridade/legendary_64x64.png';
import Legendary128 from '../assets/icons/raridade/legendary_128x128.png';

import Secret16 from '../assets/icons/raridade/secret_16x16.png';
import Secret24 from '../assets/icons/raridade/secret_24x24.png';
import Secret32 from '../assets/icons/raridade/secret_32x32.png';
import Secret48 from '../assets/icons/raridade/secret_48x48.png';
import Secret64 from '../assets/icons/raridade/secret_64x64.png';
import Secret128 from '../assets/icons/raridade/secret_128x128.png';

import Ultra16 from '../assets/icons/raridade/ultra_16x16.png';
import Ultra24 from '../assets/icons/raridade/ultra_24x24.png';
import Ultra32 from '../assets/icons/raridade/ultra_32x32.png';
import Ultra48 from '../assets/icons/raridade/ultra_48x48.png';
import Ultra64 from '../assets/icons/raridade/ultra_64x64.png';
import Ultra128 from '../assets/icons/raridade/ultra_128x128.png';

import Crisis16 from '../assets/icons/raridade/crisis_16x16.png';
import Crisis24 from '../assets/icons/raridade/crisis_24x24.png';
import Crisis32 from '../assets/icons/raridade/crisis_32x32.png';
import Crisis48 from '../assets/icons/raridade/crisis_48x48.png';
import Crisis64 from '../assets/icons/raridade/crisis_64x64.png';
import Crisis128 from '../assets/icons/raridade/crisis_128x128.png';

import Booster16 from '../assets/icons/raridade/booster_16x16.png';
import Booster24 from '../assets/icons/raridade/booster_24x24.png';
import Booster32 from '../assets/icons/raridade/booster_32x32.png';
import Booster48 from '../assets/icons/raridade/booster_48x48.png';
import Booster64 from '../assets/icons/raridade/booster_64x64.png';
import Booster128 from '../assets/icons/raridade/booster_128x128.png';

// Interface para o componente de ícone PNG
interface IconPNGProps {
  size?: 8 | 16 | 24 | 32 | 48 | 64 | 128 | 256 | 512;
  className?: string;
  alt?: string;
}

// Componentes de ícones de recursos
export const CoinsIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Coins' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Coins16;
      case 24: return Coins24;
      case 32: return Coins32;
      case 48: return Coins48;
      case 64: return Coins64;
      case 128: return Coins128;
      default: return Coins32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const FoodsIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Foods' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Foods16;
      case 24: return Foods24;
      case 32: return Foods32;
      case 48: return Foods48;
      case 64: return Foods64;
      case 128: return Foods128;
      default: return Foods32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const MaterialsIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Materials' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Materials16;
      case 24: return Materials24;
      case 32: return Materials32;
      case 48: return Materials48;
      case 64: return Materials64;
      case 128: return Materials128;
      default: return Materials32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const PopulationIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Population' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Population16;
      case 24: return Population24;
      case 32: return Population32;
      case 48: return Population48;
      case 64: return Population64;
      case 128: return Population128;
      default: return Population32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

// Componentes de ícones de tipos de cartas
export const ActionIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Action' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Action16;
      case 24: return Action24;
      case 32: return Action32;
      case 48: return Action48;
      case 64: return Action64;
      case 128: return Action128;
      default: return Action32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const CityIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'City' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return City16;
      case 24: return City24;
      case 32: return City32;
      case 48: return City48;
      case 64: return City64;
      case 128: return City128;
      default: return City32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const DefenseIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Defense' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Defense16;
      case 24: return Defense24;
      case 32: return Defense32;
      case 48: return Defense48;
      case 64: return Defense64;
      case 128: return Defense128;
      default: return Defense32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const EventIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Event' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Event16;
      case 24: return Event24;
      case 32: return Event32;
      case 48: return Event48;
      case 64: return Event64;
      case 128: return Event128;
      default: return Event32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const FarmIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Farm' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Farm16;
      case 24: return Farm24;
      case 32: return Farm32;
      case 48: return Farm48;
      case 64: return Farm64;
      case 128: return Farm128;
      default: return Farm32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const LandmarkIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Landmark' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Landmark16;
      case 24: return Landmark24;
      case 32: return Landmark32;
      case 48: return Landmark48;
      case 64: return Landmark64;
      case 128: return Landmark128;
      default: return Landmark32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const MagicIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Magic' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Magic16;
      case 24: return Magic24;
      case 32: return Magic32;
      case 48: return Magic48;
      case 64: return Magic64;
      case 128: return Magic128;
      default: return Magic32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const TrapIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Trap' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Trap16;
      case 24: return Trap24;
      case 32: return Trap32;
      case 48: return Trap48;
      case 64: return Trap64;
      case 128: return Trap128;
      default: return Trap32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

// Componentes de ícones de raridade
export const CommonIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Common' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Common16;
      case 24: return Common24;
      case 32: return Common32;
      case 48: return Common48;
      case 64: return Common64;
      case 128: return Common128;
      default: return Common32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const UncommonIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Uncommon' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Uncommon16;
      case 24: return Uncommon24;
      case 32: return Uncommon32;
      case 48: return Uncommon48;
      case 64: return Uncommon64;
      case 128: return Uncommon128;
      default: return Uncommon32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const RareIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Rare' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Rare16;
      case 24: return Rare24;
      case 32: return Rare32;
      case 48: return Rare48;
      case 64: return Rare64;
      case 128: return Rare128;
      default: return Rare32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const LegendaryIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Legendary' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Legendary16;
      case 24: return Legendary24;
      case 32: return Legendary32;
      case 48: return Legendary48;
      case 64: return Legendary64;
      case 128: return Legendary128;
      default: return Legendary32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const SecretIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Secret' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Secret16;
      case 24: return Secret24;
      case 32: return Secret32;
      case 48: return Secret48;
      case 64: return Secret64;
      case 128: return Secret128;
      default: return Secret32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const UltraIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Ultra' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Ultra16;
      case 24: return Ultra24;
      case 32: return Ultra32;
      case 48: return Ultra48;
      case 64: return Ultra64;
      case 128: return Ultra128;
      default: return Ultra32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const CrisisIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Crisis' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Crisis16;
      case 24: return Crisis24;
      case 32: return Crisis32;
      case 48: return Crisis48;
      case 64: return Crisis64;
      case 128: return Crisis128;
      default: return Crisis32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

export const BoosterIconPNG: React.FC<IconPNGProps> = ({ size = 32, className = '', alt = 'Booster' }) => {
  const getIcon = () => {
    switch (size) {
      case 16: return Booster16;
      case 24: return Booster24;
      case 32: return Booster32;
      case 48: return Booster48;
      case 64: return Booster64;
      case 128: return Booster128;
      default: return Booster32;
    }
  };

  return <img src={getIcon()} alt={alt} className={className} style={{ width: size, height: size }} />;
};

// Funções helper para obter ícones por string
export const getResourceIconPNG = (type: string, size: 8 | 16 | 24 | 32 | 48 | 64 | 128 | 256 | 512 = 32) => {
  switch (type) {
    case 'coins': return <CoinsIconPNG size={size} />;
    case 'food': return <FoodsIconPNG size={size} />;
    case 'materials': return <MaterialsIconPNG size={size} />;
    case 'population': return <PopulationIconPNG size={size} />;
    default: return <span className="text-lg">📊</span>;
  }
};

export const getCardTypeIconPNG = (type: string, size: 8 | 16 | 24 | 32 | 48 | 64 | 128 | 256 | 512 = 32) => {
  switch (type) {
    case 'action': return <ActionIconPNG size={size} />;
    case 'city': return <CityIconPNG size={size} />;
    case 'defense': return <DefenseIconPNG size={size} />;
    case 'event': return <EventIconPNG size={size} />;
    case 'farm': return <FarmIconPNG size={size} />;
    case 'landmark': return <LandmarkIconPNG size={size} />;
    case 'magic': return <MagicIconPNG size={size} />;
    case 'trap': return <TrapIconPNG size={size} />;
    default: return <span className="text-lg">❓</span>;
  }
};

export const getRarityIconPNG = (rarity: string, size: 8 | 16 | 24 | 32 | 48 | 64 | 128 | 256 | 512 = 32) => {
  switch (rarity) {
    case 'common': return <CommonIconPNG size={size} />;
    case 'uncommon': return <UncommonIconPNG size={size} />;
    case 'rare': return <RareIconPNG size={size} />;
    case 'legendary': return <LegendaryIconPNG size={size} />;
    case 'secret': return <SecretIconPNG size={size} />;
    case 'ultra': return <UltraIconPNG size={size} />;
    case 'crisis': return <CrisisIconPNG size={size} />;
    case 'booster': return <BoosterIconPNG size={size} />;
    default: return <span className="text-lg">⭐</span>;
  }
};

// Logo do Jogo
export const GameLogoPNG: React.FC<IconPNGProps> = ({ size = 64, className = "" }) => {
  const getImageSrc = () => {
    switch (size) {
      case 16: return "/src/assets/icons/Seu Império aguarda_16x16.png";
      case 24: return "/src/assets/icons/Seu Império aguarda_24x24.png";
      case 32: return "/src/assets/icons/Seu Império aguarda_32x32.png";
      case 48: return "/src/assets/icons/Seu Império aguarda_48x48.png";
      case 64: return "/src/assets/icons/Seu Império aguarda_64x64.png";
      case 128: return "/src/assets/icons/Seu Império aguarda_128x128.png";
      case 256: return "/src/assets/icons/Seu Império aguarda_256x256.png";
      case 512: return "/src/assets/icons/Seu Império aguarda_512x512.png";
      default: return "/src/assets/icons/Seu Império aguarda_64x64.png";
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt="Farmand Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}; 
