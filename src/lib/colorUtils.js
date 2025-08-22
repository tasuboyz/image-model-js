// Browser-friendly color utils: small common-name map + HSL fallback
function normalizeHex(hex) {
    if (!hex || typeof hex !== 'string') return null;
    hex = hex.replace('#', '').trim();
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return null;
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return `#${hex.toLowerCase()}`;
}

// small curated map for common web colors (hex -> friendly name)
const COMMON_COLOR_MAP = {
    '#3b82f6': 'vivid blue', // example
    '#1e3a8a': 'indigo',
    '#ef4444': 'red',
    '#f59e0b': 'amber',
    '#10b981': 'emerald',
    '#111827': 'almost black',
    '#ffffff': 'white',
    '#000000': 'black',
    '#fef3c7': 'pale yellow',
    '#60a5fa': 'light blue',
    '#94a3b8': 'muted gray'
};

export function hexToFriendlyName(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return hex;
    if (COMMON_COLOR_MAP[normalized]) return COMMON_COLOR_MAP[normalized];
    return hslDescribeFromHex(normalized);
}

export function hslDescribeFromHex(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return hex;

    const r = parseInt(normalized.slice(1,3),16);
    const g = parseInt(normalized.slice(3,5),16);
    const b = parseInt(normalized.slice(5,7),16);

    const rn = r/255, gn = g/255, bn = b/255;
    const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
    let h=0, s=0, l=(max+min)/2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d/(2 - max - min) : d/(max + min);
        switch(max) {
            case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
            case gn: h = (bn - rn) / d + 2; break;
            case bn: h = (rn - gn) / d + 4; break;
        }
        h = Math.round(h * 60);
    } else {
        h = 0; s = 0;
    }
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    const qualifiers = [];
    if (l <= 10) qualifiers.push('very dark');
    else if (l <= 30) qualifiers.push('dark');
    else if (l >= 90) qualifiers.push('very light');
    else if (l >= 70) qualifiers.push('light');

    if (s <= 10) qualifiers.push('desaturated');
    else if (s <= 30) qualifiers.push('muted');
    else if (s >= 70) qualifiers.push('vibrant');

    const bucket = (() => {
        if (s <= 10 && l >= 25 && l <= 75) return 'gray';
        if (l >= 95) return 'white';
        if (l <= 5) return 'black';
        if (h >= 330 || h < 15) return 'red';
        if (h >= 15 && h < 45) return 'orange';
        if (h >= 45 && h < 75) return 'yellow';
        if (h >= 75 && h < 165) return 'green';
        if (h >= 165 && h < 195) return 'teal';
        if (h >= 195 && h < 255) return 'blue';
        if (h >= 255 && h < 285) return 'purple';
        if (h >= 285 && h < 330) return 'pink';
        return 'color';
    })();

    const dedup = qualifiers.filter(q => !(bucket === 'gray' && q === 'desaturated'));
    const desc = (dedup.length ? dedup.join(' ') + ' ' : '') + bucket;
    return desc.trim();
}

export default {
    hexToFriendlyName,
    hslDescribeFromHex
};
