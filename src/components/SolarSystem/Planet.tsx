import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Moon } from './Moon';

// Planet configuration for realistic appearance
const PLANET_CONFIGS: Record<string, {
  baseColor: string;
  secondaryColor: string;
  atmosphereColor: string;
  hasRings?: boolean;
  ringColor?: string;
  hasStripes?: boolean;
  hasClouds?: boolean;
  surfaceRoughness?: number;
  moons?: { orbitRadius: number; size: number; color: string; orbitSpeed: number; initialAngle?: number }[];
  uranusRings?: boolean;
}> = {
  'Mercury': {
    baseColor: '#8C7853',
    secondaryColor: '#6B5B45',
    atmosphereColor: '#A09080',
    surfaceRoughness: 0.9,
  },
  'Venus': {
    baseColor: '#E6C47A',
    secondaryColor: '#D4A84B',
    atmosphereColor: '#FFD89B',
    hasClouds: true,
    surfaceRoughness: 0.3,
  },
  'Earth': {
    baseColor: '#4A90D9',
    secondaryColor: '#2D6B3F',
    atmosphereColor: '#87CEEB',
    hasClouds: true,
    surfaceRoughness: 0.5,
    moons: [
      { orbitRadius: 1.2, size: 0.15, color: '#C0C0C0', orbitSpeed: 0.8 }
    ],
  },
  'Mars': {
    baseColor: '#CD5C5C',
    secondaryColor: '#8B4513',
    atmosphereColor: '#DEB887',
    surfaceRoughness: 0.8,
    moons: [
      { orbitRadius: 0.9, size: 0.06, color: '#A89080', orbitSpeed: 1.5, initialAngle: 0 },
      { orbitRadius: 1.2, size: 0.04, color: '#B8A090', orbitSpeed: 1.0, initialAngle: Math.PI },
    ],
  },
  'Jupiter': {
    baseColor: '#D4A574',
    secondaryColor: '#8B6914',
    atmosphereColor: '#F4A460',
    hasStripes: true,
    surfaceRoughness: 0.2,
    moons: [
      { orbitRadius: 1.5, size: 0.12, color: '#FFE4B5', orbitSpeed: 1.2, initialAngle: 0 },
      { orbitRadius: 1.8, size: 0.1, color: '#DEB887', orbitSpeed: 0.9, initialAngle: Math.PI / 2 },
      { orbitRadius: 2.1, size: 0.08, color: '#D2B48C', orbitSpeed: 0.6, initialAngle: Math.PI },
      { orbitRadius: 2.4, size: 0.14, color: '#F5DEB3', orbitSpeed: 0.4, initialAngle: Math.PI * 1.5 },
    ],
  },
  'Saturn': {
    baseColor: '#F4D03F',
    secondaryColor: '#D4A84B',
    atmosphereColor: '#FAD02C',
    hasRings: true,
    ringColor: '#C9B896',
    hasStripes: true,
    surfaceRoughness: 0.2,
    moons: [
      { orbitRadius: 2.8, size: 0.18, color: '#FFF8DC', orbitSpeed: 0.5, initialAngle: 0.5 },
      { orbitRadius: 3.2, size: 0.08, color: '#FFFACD', orbitSpeed: 0.7, initialAngle: 2.5 },
      { orbitRadius: 3.6, size: 0.1, color: '#F0E68C', orbitSpeed: 0.4, initialAngle: 1.2 },
    ],
  },
  'Uranus': {
    baseColor: '#72CFF8',
    secondaryColor: '#4AB8E8',
    atmosphereColor: '#AFEEEE',
    hasRings: true,
    ringColor: '#A8C8D8',
    surfaceRoughness: 0.3,
    uranusRings: true,
    moons: [
      { orbitRadius: 1.4, size: 0.08, color: '#B0C4DE', orbitSpeed: 0.8, initialAngle: 0 },
      { orbitRadius: 1.7, size: 0.1, color: '#ADD8E6', orbitSpeed: 0.6, initialAngle: Math.PI / 3 },
      { orbitRadius: 2.0, size: 0.07, color: '#87CEEB', orbitSpeed: 0.5, initialAngle: Math.PI },
      { orbitRadius: 2.3, size: 0.09, color: '#B0E0E6', orbitSpeed: 0.4, initialAngle: Math.PI * 1.5 },
      { orbitRadius: 2.6, size: 0.11, color: '#AFEEEE', orbitSpeed: 0.3, initialAngle: Math.PI / 6 },
    ],
  },
  'Neptune': {
    baseColor: '#4169E1',
    secondaryColor: '#1E3A8A',
    atmosphereColor: '#6495ED',
    surfaceRoughness: 0.3,
    moons: [
      { orbitRadius: 1.3, size: 0.12, color: '#E0E0E0', orbitSpeed: 0.6 },
      { orbitRadius: 1.6, size: 0.06, color: '#D0D0D0', orbitSpeed: 0.9, initialAngle: Math.PI / 2 },
    ],
  },
};

// Map branch labels to planet types
const BRANCH_TO_PLANET: Record<string, string> = {
  'CSE': 'Earth',
  'CSE AI': 'Mars',
  'CSE AI-DS': 'Jupiter',
  'CSE CS': 'Saturn',
  'IT': 'Venus',
  'ECM': 'Neptune',
};

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  glowColor: string;
  label?: string;
  onClick?: () => void;
  isSelectable?: boolean;
  planetType?: string;
}

export const Planet = ({ 
  position, 
  size, 
  color, 
  glowColor, 
  label, 
  onClick,
  isSelectable = true,
  planetType
}: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Determine planet configuration
  const resolvedPlanetType = planetType || (label ? BRANCH_TO_PLANET[label] : undefined) || 'Earth';
  const config = PLANET_CONFIGS[resolvedPlanetType] || PLANET_CONFIGS['Earth'];

  // Create procedural planet material with enhanced details
  const planetMaterial = useMemo(() => {
    const isEarth = resolvedPlanetType === 'Earth';
    const isMars = resolvedPlanetType === 'Mars';
    const isJupiter = resolvedPlanetType === 'Jupiter';
    const isSaturn = resolvedPlanetType === 'Saturn';
    const isVenus = resolvedPlanetType === 'Venus';
    const isNeptune = resolvedPlanetType === 'Neptune';
    const isUranus = resolvedPlanetType === 'Uranus';
    const isMercury = resolvedPlanetType === 'Mercury';

    return new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Color(config.baseColor) },
        secondaryColor: { value: new THREE.Color(config.secondaryColor) },
        atmosphereColor: { value: new THREE.Color(config.atmosphereColor) },
        hasStripes: { value: config.hasStripes || false },
        roughness: { value: config.surfaceRoughness || 0.5 },
        time: { value: 0 },
        isEarth: { value: isEarth },
        isMars: { value: isMars },
        isJupiter: { value: isJupiter },
        isSaturn: { value: isSaturn },
        isVenus: { value: isVenus },
        isNeptune: { value: isNeptune },
        isUranus: { value: isUranus },
        isMercury: { value: isMercury },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform vec3 secondaryColor;
        uniform vec3 atmosphereColor;
        uniform bool hasStripes;
        uniform float roughness;
        uniform float time;
        uniform bool isEarth;
        uniform bool isMars;
        uniform bool isJupiter;
        uniform bool isSaturn;
        uniform bool isVenus;
        uniform bool isNeptune;
        uniform bool isUranus;
        uniform bool isMercury;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Advanced noise functions
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float hash3(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float noise3D(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float n000 = hash3(i);
          float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
          float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
          float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
          float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
          float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
          float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
          float n111 = hash3(i + vec3(1.0, 1.0, 1.0));
          
          float nx00 = mix(n000, n100, f.x);
          float nx10 = mix(n010, n110, f.x);
          float nx01 = mix(n001, n101, f.x);
          float nx11 = mix(n011, n111, f.x);
          
          float nxy0 = mix(nx00, nx10, f.y);
          float nxy1 = mix(nx01, nx11, f.y);
          
          return mix(nxy0, nxy1, f.z);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        float fbm3D(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise3D(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        // Voronoi for craters
        float voronoi(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float minDist = 1.0;
          for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
              vec2 neighbor = vec2(float(x), float(y));
              vec2 point = vec2(hash(i + neighbor), hash(i + neighbor + vec2(31.0, 17.0)));
              vec2 diff = neighbor + point - f;
              float dist = length(diff);
              minDist = min(minDist, dist);
            }
          }
          return minDist;
        }
        
        // Crater function
        float crater(vec2 p, float scale) {
          float v = voronoi(p * scale);
          float rim = smoothstep(0.2, 0.3, v) - smoothstep(0.3, 0.35, v);
          float bowl = 1.0 - smoothstep(0.0, 0.25, v);
          return rim * 0.3 - bowl * 0.15;
        }
        
        // Storm vortex pattern
        float vortex(vec2 p, vec2 center, float size) {
          vec2 d = p - center;
          float dist = length(d);
          float angle = atan(d.y, d.x);
          float spiral = sin(angle * 3.0 + dist * 10.0 - time * 0.5);
          return smoothstep(size, 0.0, dist) * (0.5 + 0.5 * spiral);
        }
        
        void main() {
          vec3 color = baseColor;
          vec3 pos3D = vPosition * 5.0;
          
          // ========== EARTH ==========
          if (isEarth) {
            // Continents using 3D noise
            float continentNoise = fbm3D(pos3D * 1.5);
            float landMask = smoothstep(0.45, 0.55, continentNoise);
            
            // Ocean colors with depth variation
            vec3 deepOcean = vec3(0.05, 0.15, 0.4);
            vec3 shallowOcean = vec3(0.1, 0.4, 0.6);
            float oceanDepth = fbm3D(pos3D * 3.0);
            vec3 oceanColor = mix(deepOcean, shallowOcean, oceanDepth);
            
            // Land colors with biomes
            vec3 desert = vec3(0.76, 0.7, 0.5);
            vec3 forest = vec3(0.13, 0.35, 0.15);
            vec3 mountains = vec3(0.35, 0.3, 0.25);
            vec3 snow = vec3(0.95, 0.95, 1.0);
            
            float biomeNoise = fbm3D(pos3D * 2.0 + vec3(100.0));
            float elevation = fbm3D(pos3D * 4.0);
            
            vec3 landColor = mix(desert, forest, biomeNoise);
            landColor = mix(landColor, mountains, smoothstep(0.6, 0.8, elevation));
            landColor = mix(landColor, snow, smoothstep(0.85, 0.95, elevation));
            
            // Polar ice caps
            float polarY = abs(vPosition.y) / length(vPosition);
            float iceCap = smoothstep(0.7, 0.85, polarY);
            
            color = mix(oceanColor, landColor, landMask);
            color = mix(color, snow, iceCap);
            
            // City lights hint on dark side
            vec3 lightDir = normalize(vec3(-1.0, 0.5, 1.0));
            float darkSide = 1.0 - max(dot(vNormal, lightDir), 0.0);
            float cities = fbm(vUv * 50.0) * landMask * darkSide;
            color += vec3(1.0, 0.9, 0.6) * smoothstep(0.7, 0.9, cities) * 0.3;
          }
          
          // ========== MARS ==========
          else if (isMars) {
            // Varied terrain
            float terrain = fbm3D(pos3D * 2.0);
            vec3 rustRed = vec3(0.75, 0.3, 0.15);
            vec3 dustyOrange = vec3(0.85, 0.5, 0.3);
            vec3 darkRock = vec3(0.3, 0.15, 0.1);
            
            color = mix(rustRed, dustyOrange, terrain);
            
            // Olympus Mons (large volcano)
            vec2 olympusPos = vec2(0.3, 0.5);
            float olympusDist = length(vUv - olympusPos);
            float volcano = smoothstep(0.15, 0.0, olympusDist);
            color = mix(color, darkRock, volcano * 0.6);
            
            // Valles Marineris (canyon system)
            float canyon = smoothstep(0.48, 0.52, vUv.y) * smoothstep(0.3, 0.7, vUv.x);
            canyon *= fbm(vUv * 30.0);
            color = mix(color, darkRock, canyon * 0.4);
            
            // Craters
            float craters = crater(vUv, 15.0) + crater(vUv + vec2(0.3, 0.7), 20.0);
            color += vec3(craters * 0.3);
            
            // Polar ice caps (CO2 ice)
            float polarY = abs(vPosition.y) / length(vPosition);
            float iceCap = smoothstep(0.75, 0.9, polarY);
            color = mix(color, vec3(0.9, 0.85, 0.8), iceCap);
            
            // Dust storms
            float storm = fbm(vUv * 8.0 + vec2(time * 0.02, 0.0));
            color = mix(color, vec3(0.8, 0.6, 0.4), storm * 0.15);
          }
          
          // ========== JUPITER ==========
          else if (isJupiter) {
            // Complex band structure
            float y = vUv.y;
            float bandNoise = fbm(vec2(vUv.x * 2.0, y * 0.5) + vec2(time * 0.01, 0.0));
            float bands = sin(y * 25.0 + bandNoise * 4.0);
            
            vec3 cream = vec3(0.95, 0.9, 0.75);
            vec3 brown = vec3(0.6, 0.4, 0.2);
            vec3 orange = vec3(0.9, 0.6, 0.3);
            vec3 white = vec3(0.98, 0.95, 0.9);
            
            color = mix(cream, brown, smoothstep(-0.3, 0.3, bands));
            color = mix(color, orange, smoothstep(0.5, 0.8, bands) * 0.5);
            color = mix(color, white, smoothstep(-0.8, -0.5, bands) * 0.3);
            
            // Turbulent flow patterns
            float turbulence = fbm(vUv * 15.0 + vec2(time * 0.02, bands));
            color = mix(color, color * 0.8, turbulence * 0.3);
            
            // Great Red Spot
            vec2 grsCenter = vec2(0.65, 0.55);
            float grsDist = length((vUv - grsCenter) * vec2(1.0, 2.0));
            float grs = vortex(vUv, grsCenter, 0.08);
            vec3 grsColor = vec3(0.8, 0.3, 0.2);
            color = mix(color, grsColor, grs * 0.8);
            
            // Smaller storms
            float storm1 = vortex(vUv, vec2(0.2, 0.3), 0.03);
            float storm2 = vortex(vUv, vec2(0.8, 0.7), 0.025);
            color = mix(color, white, (storm1 + storm2) * 0.4);
          }
          
          // ========== SATURN ==========
          else if (isSaturn) {
            // Subtle banded structure
            float y = vUv.y;
            float bandNoise = fbm(vec2(vUv.x * 1.5, y * 0.3));
            float bands = sin(y * 20.0 + bandNoise * 2.0);
            
            vec3 gold = vec3(0.9, 0.8, 0.5);
            vec3 cream = vec3(0.95, 0.9, 0.75);
            vec3 tan = vec3(0.82, 0.7, 0.55);
            
            color = mix(gold, cream, smoothstep(-0.5, 0.5, bands) * 0.4);
            color = mix(color, tan, fbm(vUv * 10.0) * 0.2);
            
            // Hexagonal polar storm
            float polarY = vPosition.y / length(vPosition);
            if (polarY > 0.8) {
              float hex = abs(sin(atan(vPosition.x, vPosition.z) * 3.0));
              color = mix(color, vec3(0.7, 0.6, 0.4), hex * (polarY - 0.8) * 3.0);
            }
            
            // Subtle cloud patterns
            float clouds = fbm(vUv * 20.0 + vec2(time * 0.01, 0.0));
            color = mix(color, color * 1.1, clouds * 0.15);
          }
          
          // ========== VENUS ==========
          else if (isVenus) {
            // Thick sulfuric cloud layers
            float cloudLayer1 = fbm(vUv * 4.0 + vec2(time * 0.008, 0.0));
            float cloudLayer2 = fbm(vUv * 8.0 - vec2(time * 0.012, 0.0));
            float cloudLayer3 = fbm(vUv * 16.0 + vec2(0.0, time * 0.01));
            
            vec3 yellowCloud = vec3(0.95, 0.85, 0.55);
            vec3 orangeCloud = vec3(0.9, 0.7, 0.4);
            vec3 darkCloud = vec3(0.7, 0.55, 0.35);
            
            color = mix(yellowCloud, orangeCloud, cloudLayer1);
            color = mix(color, darkCloud, cloudLayer2 * 0.4);
            color = mix(color, yellowCloud * 1.1, cloudLayer3 * 0.3);
            
            // Swirling vortex at poles
            float polarY = abs(vPosition.y) / length(vPosition);
            float vortexPattern = sin(atan(vPosition.x, vPosition.z) * 2.0 + time * 0.1) * polarY;
            color = mix(color, darkCloud, vortexPattern * smoothstep(0.6, 0.9, polarY) * 0.3);
          }
          
          // ========== NEPTUNE ==========
          else if (isNeptune) {
            // Deep blue with subtle banding
            vec3 deepBlue = vec3(0.15, 0.25, 0.6);
            vec3 lightBlue = vec3(0.3, 0.45, 0.8);
            vec3 white = vec3(0.9, 0.95, 1.0);
            
            float bands = sin(vUv.y * 15.0 + fbm(vUv * 5.0) * 2.0);
            color = mix(deepBlue, lightBlue, bands * 0.3 + 0.5);
            
            // Great Dark Spot
            vec2 gdsCenter = vec2(0.4, 0.45);
            float gdsDist = length((vUv - gdsCenter) * vec2(1.2, 1.8));
            float gds = smoothstep(0.1, 0.0, gdsDist);
            color = mix(color, deepBlue * 0.7, gds * 0.6);
            
            // High altitude white clouds
            float clouds = fbm(vUv * 20.0 + vec2(time * 0.03, 0.0));
            float cloudMask = smoothstep(0.6, 0.8, clouds);
            color = mix(color, white, cloudMask * 0.4);
            
            // Fast moving storm features
            float storms = fbm(vUv * 30.0 + vec2(time * 0.05, 0.0));
            color = mix(color, white, smoothstep(0.75, 0.9, storms) * 0.3);
          }
          
          // ========== URANUS ==========
          else if (isUranus) {
            // Featureless pale blue-green
            vec3 paleBlue = vec3(0.6, 0.85, 0.9);
            vec3 cyan = vec3(0.5, 0.8, 0.85);
            vec3 white = vec3(0.95, 0.98, 1.0);
            
            float subtleBands = sin(vUv.y * 8.0) * 0.1;
            color = mix(paleBlue, cyan, subtleBands + 0.5);
            
            // Very subtle cloud features
            float clouds = fbm(vUv * 10.0 + vec2(time * 0.005, 0.0));
            color = mix(color, white, clouds * 0.1);
            
            // Polar collar
            float polarY = abs(vPosition.y) / length(vPosition);
            color = mix(color, cyan * 0.9, smoothstep(0.7, 0.9, polarY) * 0.3);
          }
          
          // ========== MERCURY ==========
          else if (isMercury) {
            // Heavily cratered surface
            vec3 gray = vec3(0.5, 0.48, 0.45);
            vec3 darkGray = vec3(0.3, 0.28, 0.26);
            vec3 lightGray = vec3(0.65, 0.62, 0.58);
            
            float baseTerrain = fbm3D(pos3D * 3.0);
            color = mix(darkGray, gray, baseTerrain);
            
            // Multiple crater layers
            float craters1 = crater(vUv, 10.0);
            float craters2 = crater(vUv + vec2(0.5), 25.0);
            float craters3 = crater(vUv * 1.5, 40.0);
            float allCraters = craters1 + craters2 * 0.7 + craters3 * 0.5;
            
            color += vec3(allCraters * 0.4);
            
            // Bright ray craters
            float rays = fbm(vUv * 50.0);
            color = mix(color, lightGray, smoothstep(0.7, 0.9, rays) * 0.3);
            
            // Smooth plains (lava flows)
            float plains = fbm(vUv * 5.0);
            color = mix(color, gray * 0.9, smoothstep(0.55, 0.65, plains) * 0.2);
          }
          
          // ========== DEFAULT (fallback) ==========
          else {
            float detail = fbm(vUv * 8.0);
            color = mix(color, secondaryColor, detail * 0.5);
            
            if (hasStripes) {
              float stripe = sin(vUv.y * 30.0 + fbm(vUv * 4.0) * 3.0) * 0.5 + 0.5;
              color = mix(color, secondaryColor, stripe * 0.4);
            }
            
            float craterDetail = fbm(vUv * 20.0);
            color = mix(color, color * 0.8, craterDetail * roughness * 0.3);
          }
          
          // ========== LIGHTING ==========
          vec3 lightDir = normalize(vec3(-1.0, 0.5, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          
          // Soft shadows
          float shadow = smoothstep(0.0, 0.3, diff);
          color *= 0.3 + shadow * 0.7;
          
          // Specular highlight
          vec3 viewDir = normalize(-vWorldPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);
          color += vec3(spec * 0.15);
          
          // Rim lighting (atmosphere effect)
          float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          color += atmosphereColor * rim * rim * 0.25;
          
          // Fresnel effect
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          color = mix(color, atmosphereColor, fresnel * 0.15);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, [config, resolvedPlanetType]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    planetMaterial.uniforms.time.value = time;
    
    // Slow planet rotation on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
    }
    
    if (glowRef.current && hovered) {
      const scale = 1.3 + Math.sin(time * 3) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.05;
    }
  });

  const handlePointerEnter = () => {
    if (isSelectable) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={position}>
      {/* Planet core with procedural texture */}
      <mesh
        ref={meshRef}
        onClick={isSelectable ? onClick : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        material={planetMaterial}
      >
        <sphereGeometry args={[size, 64, 64]} />
      </mesh>

      {/* Cloud layer for planets with atmosphere */}
      {config.hasClouds && (
        <mesh ref={cloudsRef} scale={1.02}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.15}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {/* Atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Realistic Saturn-style rings */}
      {config.hasRings && !config.uranusRings && (
        <group rotation={[Math.PI / 2.5, 0, 0]}>
          {/* Inner ring */}
          <mesh>
            <ringGeometry args={[size * 1.3, size * 1.5, 128]} />
            <meshBasicMaterial
              color="#A89078"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Main ring */}
          <mesh>
            <ringGeometry args={[size * 1.55, size * 1.9, 128]} />
            <meshBasicMaterial
              color={config.ringColor}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Cassini division (gap) */}
          <mesh>
            <ringGeometry args={[size * 1.9, size * 1.95, 128]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Outer ring */}
          <mesh>
            <ringGeometry args={[size * 1.95, size * 2.3, 128]} />
            <meshBasicMaterial
              color="#C9B896"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Faint outer ring */}
          <mesh>
            <ringGeometry args={[size * 2.3, size * 2.6, 128]} />
            <meshBasicMaterial
              color="#B8A888"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Uranus-style vertical rings */}
      {config.uranusRings && (
        <group rotation={[0.1, 0, Math.PI / 2]}>
          <mesh>
            <ringGeometry args={[size * 1.4, size * 1.5, 64]} />
            <meshBasicMaterial
              color="#7EB8C9"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 1.55, size * 1.7, 64]} />
            <meshBasicMaterial
              color="#A8C8D8"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Glow effect */}
      <mesh ref={glowRef} scale={hovered ? 1.3 : 1.15}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={hovered ? 0.4 : 0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Hover ring */}
      {hovered && isSelectable && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.7, 64]} />
          <meshBasicMaterial
            color={config.atmosphereColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Moons */}
      {config.moons && config.moons.map((moon, index) => (
        <Moon
          key={`moon-${index}`}
          orbitRadius={moon.orbitRadius * size}
          size={moon.size * size}
          color={moon.color}
          orbitSpeed={moon.orbitSpeed}
          initialAngle={moon.initialAngle}
        />
      ))}

      {/* Label */}
      {label && (
        <Html
          position={[0, size + 0.8, 0]}
          center
          distanceFactor={15}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div 
            className={`planet-label transition-all duration-300 whitespace-nowrap ${
              hovered ? 'scale-110 shadow-[0_0_20px_hsl(var(--primary))]' : ''
            }`}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};
