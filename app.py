#!/usr/bin/env python3
"""
Flask Backend for Image Prompt Builder
Supporta la generazione di prompt per modelli umani con outfit consistente
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from datetime import datetime
import sqlite3
import os

# Configurazione logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inizializza Flask app e configura la cartella static per servire frontend
# Usa la cartella corrente come static_folder così `index.html` e `app.js`
# vengono serviti da Flask (es. http://localhost:5000/)
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS per comunicazione con frontend

# Configurazione
DATABASE_PATH = 'prompts.db'

def init_database():
    """Inizializza il database SQLite"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Tabella per prompt salvati
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            prompt_text TEXT NOT NULL,
            form_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabella per preset
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS presets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            config_data TEXT NOT NULL,
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database inizializzato")

def get_db_connection():
    """Ottiene connessione al database"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Per accesso ai campi per nome
    return conn

# -----------------------------------------------------------------------------
# DATABASE DI OUTFIT E TRADUZIONI
# -----------------------------------------------------------------------------

OUTFIT_MAPPINGS = {
    # Gender
    'female': 'woman',
    'male': 'man',
    'non-binary': 'person',
    
    # Build
    'slim': 'slim build',
    'athletic': 'athletic build with toned abs and long legs',
    'curvy': 'curvy figure with natural curves',
    'muscular': 'muscular build',
    'average': 'average build',
    
    # Hair colors
    'blonde': 'blonde',
    'brunette': 'brunette',
    'black': 'black',
    'red': 'auburn',
    'gray': 'gray',
    'silver': 'silver',
    
    # Hair lengths
    'pixie': 'pixie cut',
    'short': 'short',
    'shoulder': 'shoulder-length',
    'long': 'long',
    'very-long': 'very long',
    
    # Hair styles
    'straight': 'straight',
    'wavy': 'wavy',
    'curly': 'curly',
    'braided': 'braided',
    'updo': 'styled in an updo',
    'ponytail': 'in a ponytail',
    
    # Skin tones
    'pale': 'pale skin',
    'fair': 'fair skin with warm undertones',
    'medium': 'medium skin tone',
    'olive': 'olive skin',
    'tan': 'tanned skin',
    'dark': 'dark skin',
    
    # Colors
    'black': 'black',
    'white': 'white',
    'red': 'red',
    'blue': 'blue',
    'green': 'green',
    'emerald': 'emerald',
    'gold': 'gold',
    'silver': 'silver',
    
    # Fabrics
    'lace': 'lace',
    'silk': 'silk',
    'cotton': 'cotton',
    'leather': 'leather',
    'satin': 'satin',
    'velvet': 'velvet',
    'mesh': 'mesh',
    
    # Photography
    'near-window': 'near a window with soft daylight filtering in',
    'indoor-studio': 'in a studio setting',
    'cinematic': 'cinematic',
    'full-body': 'full body view'
}

# -----------------------------------------------------------------------------
# GENERATORE DI PROMPT
# -----------------------------------------------------------------------------

class PromptGenerator:
    """Classe per generazione intelligente di prompt"""
    
    @staticmethod
    def generate_prompt(form_data):
        """Genera prompt completo da dati form"""
        try:
            parts = []
            
            # 1. Identità base
            identity = PromptGenerator._generate_identity(form_data)
            if identity:
                parts.append(identity)
            
            # 2. Aspetto fisico
            appearance = PromptGenerator._generate_appearance(form_data)
            if appearance:
                parts.append(appearance)
            
            # 3. Outfit (head-to-toe)
            outfit_parts = PromptGenerator._generate_outfit(form_data)
            if outfit_parts:
                parts.append(f"wearing {', '.join(outfit_parts)}")
            
            # 4. Scena e fotografia
            scene = PromptGenerator._generate_scene(form_data)
            if scene:
                parts.append(scene)
            
            # Unisce tutto
            prompt = ', '.join(parts) + '.'
            
            return {
                'prompt': prompt,
                'character_count': len(prompt),
                'complexity': PromptGenerator._calculate_complexity(prompt),
                'clothing_layers': PromptGenerator._count_clothing_layers(prompt)
            }
            
        except Exception as e:
            logger.error(f"Errore nella generazione prompt: {e}")
            return {
                'prompt': 'Errore nella generazione del prompt.',
                'character_count': 0,
                'complexity': 0,
                'clothing_layers': 0
            }
    
    @staticmethod
    def _generate_identity(data):
        """Genera parte identità"""
        parts = []
        
        # Genere e età
        gender_map = {
            'female': 'Woman',
            'male': 'Man',
            'non-binary': 'Person'
        }
        
        gender = gender_map.get(data.get('gender', 'female'), 'Woman')
        age = data.get('age')
        
        if age:
            parts.append(f"{gender}, {age} years old")
        else:
            parts.append(gender)
        
        # Altezza e costituzione
        height = data.get('height')
        if height:
            parts.append(f"height {height}")
        
        build = data.get('build')
        if build:
            build_desc = OUTFIT_MAPPINGS.get(build, f"{build} build")
            parts.append(build_desc)
        
        # Dettagli femminili
        if data.get('gender') == 'female':
            bra_cup = data.get('braCup')
            bust_size = data.get('bustSize')
            
            if bra_cup and bust_size:
                bust_map = {
                    'petite': 'petite bust',
                    'average': 'average bust', 
                    'full': 'full bust',
                    'very-full': 'very full bust'
                }
                bust_desc = bust_map.get(bust_size, 'bust')
                parts.append(f"{bra_cup}-cup {bust_desc}")
        
        return ', '.join(parts) if parts else None
    
    @staticmethod
    def _generate_appearance(data):
        """Genera aspetto fisico"""
        parts = []
        
        # Capelli
        hair_parts = []
        hair_length = data.get('hairLength')
        hair_style = data.get('hairStyle')
        hair_color = data.get('hairColor')
        
        if hair_length and hair_style and hair_color:
            length_map = OUTFIT_MAPPINGS
            style_map = OUTFIT_MAPPINGS
            color_map = OUTFIT_MAPPINGS
            
            hair_parts.extend([
                length_map.get(hair_length, hair_length),
                style_map.get(hair_style, hair_style),
                color_map.get(hair_color, hair_color)
            ])
            
            parts.append(f"{', '.join(hair_parts)} hair")
        
        # Pelle
        skin_tone = data.get('skinTone')
        if skin_tone:
            skin_desc = OUTFIT_MAPPINGS.get(skin_tone, f"{skin_tone} skin")
            parts.append(skin_desc)
        
        # Occhi
        eye_color = data.get('eyeColor')
        if eye_color:
            parts.append(f"{eye_color} eyes")
        
        return ', '.join(parts) if parts else None
    
    @staticmethod
    def _generate_outfit(data):
        """Genera outfit head-to-toe"""
        outfit_parts = []
        
        # Head accessories
        headwear = data.get('headwear')
        if headwear and headwear != 'none':
            outfit_parts.append(headwear)
        
        face_accessories = data.get('faceAccessories')
        if face_accessories and face_accessories != 'none':
            outfit_parts.append(face_accessories)
        
        # Jewelry
        earrings = data.get('earrings')
        if earrings and earrings != 'none':
            earring_map = {
                'studs': 'stud earrings',
                'hoops': 'hoop earrings', 
                'dangling': 'dangling earrings'
            }
            outfit_parts.append(earring_map.get(earrings, earrings))
        
        neckwear = data.get('neckwear')
        secondary_color = data.get('secondaryColor')
        if neckwear and neckwear != 'none':
            if secondary_color and secondary_color != 'none':
                neckwear_desc = f"{secondary_color} {neckwear}"
                if neckwear == 'necklace':
                    neckwear_desc += " with green and white gemstones"
            else:
                neckwear_desc = neckwear
            outfit_parts.append(neckwear_desc)
        
        # Upper body - Intimate first
        intimate = data.get('intimate')
        primary_color = data.get('primaryColor')
        fabrics = data.get('fabrics')
        
        if intimate and intimate != 'none':
            intimate_desc = ""
            
            if primary_color:
                intimate_desc += f"{primary_color} "
            
            if fabrics and fabrics != 'none':
                intimate_desc += f"{fabrics} "
            
            if intimate == 'bra':
                intimate_desc += "balconette bra"
                if secondary_color and secondary_color != 'none':
                    intimate_desc += f" with {secondary_color} jewel centerpiece"
            else:
                intimate_desc += intimate
            
            outfit_parts.append(intimate_desc)
        
        # Upper body main
        upper_main = data.get('upperBodyMain')
        if upper_main and upper_main != 'none':
            upper_desc = ""
            
            if primary_color and intimate == 'none':
                upper_desc += f"{primary_color} "
            
            upper_desc += upper_main
            
            sleeves = data.get('sleeves')
            if sleeves and sleeves != 'sleeveless':
                upper_desc += f" with {sleeves} sleeves"
            
            outfit_parts.append(upper_desc)
        
        # Outerwear
        outerwear = data.get('outerwear')
        if outerwear and outerwear != 'none':
            outfit_parts.append(outerwear)
        
        # Lower body
        bottoms_type = data.get('bottomsType')
        if bottoms_type and bottoms_type != 'none':
            lower_desc = ""
            
            if primary_color and not intimate:
                lower_desc += f"{primary_color} "
            
            if bottoms_type == 'dress':
                bottoms_style = data.get('bottomsStyle', '')
                lower_desc += f"{bottoms_style} dress".strip()
            else:
                lower_desc += bottoms_type
                bottoms_style = data.get('bottomsStyle')
                if bottoms_style:
                    lower_desc += f" ({bottoms_style})"
            
            outfit_parts.append(lower_desc)
        
        # Lower intimate
        intimate_lower = data.get('intimateLower')
        if intimate_lower and intimate_lower != 'none':
            intimate_lower_desc = ""
            
            if primary_color:
                intimate_lower_desc += f"matching {primary_color} "
            
            if fabrics:
                intimate_lower_desc += f"{fabrics} "
            
            intimate_lower_desc += intimate_lower
            
            if intimate_lower == 'panties' and data.get('legwear') == 'stockings':
                intimate_lower_desc += " with garter straps"
            
            outfit_parts.append(intimate_lower_desc)
        
        # Legwear
        legwear = data.get('legwear')
        if legwear and legwear != 'none':
            legwear_desc = ""
            
            legwear_style = data.get('legwearStyle')
            if legwear_style:
                legwear_desc += f"{legwear_style} "
            
            if primary_color and legwear_style == 'sheer':
                legwear_desc += f"{primary_color} "
            
            legwear_desc += legwear
            
            outfit_parts.append(legwear_desc)
        
        # Footwear
        shoe_type = data.get('shoeType')
        if shoe_type and shoe_type != 'none':
            shoe_desc = ""
            
            if primary_color:
                shoe_desc += f"{primary_color} "
            
            shoe_desc += shoe_type
            
            heel_height = data.get('heelHeight')
            if heel_height and heel_height != 'flat':
                heel_map = {
                    'low': '(2")',
                    'medium': '(3")',
                    'high': '(4")',
                    'very-high': '(5")'
                }
                shoe_desc += f" {heel_map.get(heel_height, '')}"
            
            outfit_parts.append(shoe_desc)
        
        return outfit_parts
    
    @staticmethod
    def _generate_scene(data):
        """Genera scena e fotografia"""
        parts = []
        
        # Pose
        pose = data.get('pose')
        if pose:
            pose_map = {
                'standing': 'standing',
                'sitting': 'sitting',
                'reclining': 'reclining',
                'walking': 'walking',
                'dynamic': 'in dynamic pose',
                'relaxed': 'in relaxed pose',
                'editorial': 'in editorial pose'
            }
            parts.append(pose_map.get(pose, pose))
        
        # Location
        location = data.get('location')
        if location:
            location_desc = OUTFIT_MAPPINGS.get(location, location)
            parts.append(location_desc)
        
        # Photography style
        style_parts = []
        
        photography_style = data.get('photographyStyle')
        if photography_style:
            style_parts.append(f"{photography_style} photography")
        
        lighting = data.get('lighting')
        if lighting:
            lighting_map = {
                'natural': 'natural lighting',
                'studio': 'studio lighting',
                'golden-hour': 'golden hour lighting',
                'dramatic': 'dramatic lighting',
                'soft': 'warm soft lighting',
                'warm': 'warm lighting'
            }
            style_parts.append(lighting_map.get(lighting, f"{lighting} lighting"))
        
        shot_type = data.get('shotType')
        if shot_type:
            shot_map = OUTFIT_MAPPINGS
            style_parts.append(shot_map.get(shot_type, shot_type))
        
        if style_parts:
            parts.append(', '.join(style_parts))
        
        return ', '.join(parts) if parts else None
    
    @staticmethod
    def _calculate_complexity(prompt):
        """Calcola complessità prompt (0-1)"""
        factors = [
            1 if 'with' in prompt else 0,
            1 if 'wearing' in prompt else 0,
            1 if 'lace' in prompt else 0,
            1 if any(word in prompt for word in ['emerald', 'gold', 'silver']) else 0,
            1 if 'centerpiece' in prompt else 0,
            1 if 'matching' in prompt else 0,
            1 if 'garter' in prompt else 0,
            1 if 'fishnet' in prompt else 0,
            1 if any(word in prompt for word in ['cinematic', 'dramatic']) else 0,
            1 if len(prompt) > 200 else 0
        ]
        
        return min(sum(factors) / 10.0, 1.0)
    
    @staticmethod
    def _count_clothing_layers(prompt):
        """Conta layers dell'outfit"""
        layers = [
            any(word in prompt for word in ['bra', 'corset']),
            any(word in prompt for word in ['blouse', 'shirt', 'top']),
            any(word in prompt for word in ['jacket', 'coat']),
            any(word in prompt for word in ['panties', 'thong']),
            any(word in prompt for word in ['pants', 'skirt', 'dress']),
            any(word in prompt for word in ['stockings', 'tights']),
            any(word in prompt for word in ['heels', 'shoes', 'boots'])
        ]
        
        return sum(layers)

# -----------------------------------------------------------------------------
# API ENDPOINTS
# -----------------------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Image Prompt Builder API is running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


# Serve index.html at root e altri asset statici dalla cartella del progetto
@app.route('/', methods=['GET'])
def serve_index():
    """Serve la pagina principale dell'applicazione frontend"""
    return app.send_static_file('index.html')



@app.route('/api/prompts/generate', methods=['POST'])
def generate_prompt():
    """Genera prompt da dati form"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Estrae dati del form
        identity = data.get('identity', {})
        appearance = data.get('appearance', {})
        clothing = data.get('clothing', {})
        scene = data.get('scene', {})
        
        # Combina tutti i dati
        form_data = {**identity, **appearance, **clothing, **scene}
        
        # Genera prompt
        result = PromptGenerator.generate_prompt(form_data)
        
        logger.info(f"Prompt generato: {result['character_count']} caratteri")
        
        return jsonify({
            'success': True,
            'generated_prompt': result['prompt'],
            'stats': {
                'character_count': result['character_count'],
                'complexity': result['complexity'],
                'clothing_layers': result['clothing_layers']
            }
        })
        
    except Exception as e:
        logger.error(f"Errore nella generazione prompt: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/prompts/save', methods=['POST'])
def save_prompt():
    """Salva prompt nel database"""
    try:
        data = request.get_json()
        
        name = data.get('name')
        prompt_text = data.get('prompt')
        form_data = data.get('form_data', {})
        
        if not name or not prompt_text:
            return jsonify({'error': 'Name and prompt are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO saved_prompts (name, prompt_text, form_data)
            VALUES (?, ?, ?)
        ''', (name, prompt_text, json.dumps(form_data)))
        
        prompt_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logger.info(f"Prompt salvato con ID: {prompt_id}")
        
        return jsonify({
            'success': True,
            'id': prompt_id,
            'message': 'Prompt saved successfully'
        })
        
    except Exception as e:
        logger.error(f"Errore nel salvataggio prompt: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/prompts/saved', methods=['GET'])
def get_saved_prompts():
    """Recupera prompt salvati"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, prompt_text, form_data, created_at, updated_at
            FROM saved_prompts
            ORDER BY created_at DESC
            LIMIT 50
        ''')
        
        prompts = []
        for row in cursor.fetchall():
            prompts.append({
                'id': row['id'],
                'name': row['name'],
                'prompt': row['prompt_text'],
                'form_data': json.loads(row['form_data']),
                'created_at': row['created_at'],
                'updated_at': row['updated_at']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'prompts': prompts
        })
        
    except Exception as e:
        logger.error(f"Errore nel recupero prompt: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Elimina prompt salvato"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM saved_prompts WHERE id = ?', (prompt_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Prompt not found'}), 404
        
        conn.commit()
        conn.close()
        
        logger.info(f"Prompt {prompt_id} eliminato")
        
        return jsonify({
            'success': True,
            'message': 'Prompt deleted successfully'
        })
        
    except Exception as e:
        logger.error(f"Errore nell'eliminazione prompt: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/presets/default', methods=['GET'])
def get_default_presets():
    """Recupera preset predefiniti"""
    
    presets = {
        'professional': {
            'name': '💼 Business Professional',
            'description': 'Look professionale per ambiente business',
            'config': {
                'gender': 'female',
                'age': 28,
                'build': 'athletic',
                'hairColor': 'brunette',
                'upperBodyMain': 'blazer',
                'bottomsType': 'trousers',
                'shoeType': 'pumps',
                'primaryColor': 'black',
                'secondaryColor': 'white',
                'overallStyle': 'business'
            }
        },
        'elegant': {
            'name': '🌃 Elegant Evening',
            'description': 'Look elegante per la sera',
            'config': {
                'gender': 'female',
                'age': 26,
                'build': 'curvy',
                'hairColor': 'black',
                'bottomsType': 'dress',
                'bottomsStyle': 'maxi',
                'shoeType': 'heels',
                'primaryColor': 'black',
                'secondaryColor': 'gold',
                'overallStyle': 'evening'
            }
        },
        'casual': {
            'name': '👕 Casual Everyday',
            'description': 'Look casual per tutti i giorni',
            'config': {
                'gender': 'female',
                'age': 24,
                'build': 'average',
                'hairColor': 'blonde',
                'upperBodyMain': 'tshirt',
                'bottomsType': 'jeans',
                'shoeType': 'sneakers',
                'primaryColor': 'blue',
                'overallStyle': 'casual'
            }
        }
    }
    
    return jsonify({
        'success': True,
        'presets': presets
    })

# -----------------------------------------------------------------------------
# MAIN ENTRY POINT
# -----------------------------------------------------------------------------

if __name__ == '__main__':
    # Inizializza database
    init_database()
    
    # Avvia server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
