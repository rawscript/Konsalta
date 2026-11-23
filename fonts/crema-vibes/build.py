#!/usr/bin/env python3
"""
Crema Vibes Icon Font Builder
Creates TTF and OTF font files from SVG path data
Requires: fonttools (pip install fonttools)
"""

import os
import re
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.recordingPen import RecordingPen

FONT_FAMILY = "Crema Vibes"
FONT_NAME = "crema-vibes"
VERSION = "1.0.0"
UNITS_PER_EM = 1024

# Icon definitions - using only quadratic-friendly paths
# For TTF, we need to convert cubic to quadratic
ICONS = {
    'arrow-up': ('E001', 'M512 768L256 384h192v-384h128v384h192z'),
    'menu': ('E002', 'M128 704v-64h768v64h-768zM128 384v-64h768v64h-768zM128 64v-64h768v64h-768z'),
    'search': ('E003', 'M652 96c-194 0-352 158-352 352s158 352 352 352 352-158 352-352-158-352-352-352zM652 736c-159 0-288-129-288-288s129-288 288-288 288 129 288 288-129 288-288 288zM906 80l-44-44-168 168 44 44z'),
    'trending-up': ('E004', 'M128 640l256-256 192 192 320-320v192h-64v-96l-256 256-192-192-192 192zM832 192h128v128h-64v-64h-64z'),
    'chip': ('E005', 'M320 192v512h384v-512h-384zM576 640h-128v-384h128v384zM256 384h-128v-64h128v-128h64v512h-64v-128h-128v-64h128zM640 128h64v128h128v64h-128v128h128v64h-128v128h-64zM384 0h64v128h-64zM512 0h64v128h-64zM384 768h64v128h-64zM512 768h64v128h-64zM896 384h128v64h-128zM896 512h128v64h-128zM0 384h128v64h-128zM0 512h128v64h-128z'),
    'document': ('E006', 'M192 64v768h384v-256h256v-512h-640zM640 704l128-128h-128v128zM128 0h630l162 162v666q0 26-19 45t-45 19h-640q-26 0-45-19t-19-45v-768q0-26 19-45t45-19zM256 448h384v64h-384v-64zM256 576h384v64h-384v-64zM256 320h256v64h-256v-64z'),
    'target': ('E007', 'M512 64c-247 0-448 201-448 448s201 448 448 448 448-201 448-448-201-448-448-448zM512 896c-212 0-384-172-384-384s172-384 384-384 384 172 384 384-172 384-384 384zM512 192c-177 0-320 143-320 320s143 320 320 320 320-143 320-320-143-320-320-320zM512 768c-141 0-256-115-256-256s115-256 256-256 256 115 256 256-115 256-256 256zM512 320c-106 0-192 86-192 192s86 192 192 192 192-86 192-192-86-192-192-192zM512 640c-71 0-128-57-128-128s57-128 128-128 128 57 128 128-57 128-128 128z'),
    'bar-chart': ('E008', 'M128 128h128v512h-128v-512zM320 256h128v384h-128v-384zM512 64h128v576h-128v-576zM768 384h128v256h-128v-256z'),
    'layers': ('E009', 'M512 128l-384 192 384 192 384-192-384-192zM512 416l-256-128 256-128 256 128-256 128zM128 512l384 192 384-192-64-32-320 160-320-160zM128 640l384 192 384-192-64-32-320 160-320-160z'),
    'chat-bubble': ('E010', 'M832 384q0 80-40 149t-109 109-149 40q-72 0-135-34l-183 48 48-183q-34-63-34-135 0-80 40-149t109-109 149-40 149 40 109 109 40 149zM512 128c-177 0-320 143-320 320 0 64 19 124 52 176l-36 140 140-36c52 33 112 52 176 52 177 0 320-143 320-320s-143-320-320-320z'),
    'megaphone': ('E011', 'M128 320v256l512 256v-768zM576 224v384l-384-192v-192zM832 416c53 0 96-43 96-96s-43-96-96-96v192zM704 576h-64v-320h64c0-141 115-256 256-256v64c-106 0-192 86-192 192v320z'),
    'linkedin': ('E012', 'M256 704v-448h-128v448h128zM192 320c35 0 64 29 64 64s-29 64-64 64-64-29-64-64 29-64 64-64zM320 256h128v64c17-43 64-85 149-85 128 0 163 85 163 213v256h-128v-213c0-53-21-85-75-85-64 0-96 43-96 107v191h-128v-448z'),
    'whatsapp': ('E013', 'M512 64c-247 0-448 201-448 448 0 88 26 171 71 241l-48 175 175-48c70 45 153 71 241 71 247 0 448-201 448-448s-201-448-448-448zM512 857c-78 0-152-24-214-65l-15-9-107 28 28-104-10-16c-44-62-68-136-68-214 0-202 164-366 366-366s366 164 366 366-164 366-366 366zM693 576c-10-5-61-30-71-33s-17-5-24 5c-7 10-28 33-34 40-6 7-12 8-23 3-10-5-44-16-84-51-31-27-52-61-58-71-6-10-1-16 4-21 5-5 10-12 16-18 5-6 7-10 10-17 3-7 2-13-1-18s-22-54-31-74c-8-19-16-16-23-17h-19c-7 0-17 2-26 12s-35 34-35 83 36 97 41 103c5 6 71 106 171 148 24 10 43 16 57 21 24 8 46 6 63 3 19-3 61-25 69-49 9-24 9-45 6-49s-10-7-19-11z'),
    'email': ('E014', 'M128 192v512q0 26 19 45t45 19h640q26 0 45-19t19-45v-512q0-26-19-45t-45-19h-640q-26 0-45 19t-19 45zM192 192h640v64l-320 192-320-192v-64zM192 320l320 192 320-192v384h-640v-384z'),
}


def cubic_to_quadratic(x0, y0, x1, y1, x2, y2, x3, y3):
    """
    Convert a cubic Bezier curve to one or more quadratic curves.
    This is a simple midpoint approximation.
    """
    # Simple approach: use midpoint of control points
    # For better quality, use cu2qu library
    
    # Calculate the quadratic control point as average of cubic control points
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2
    
    return [(cx, cy, x3, y3)]


def parse_svg_path_to_pen(path_d, pen):
    """Parse SVG path data and draw it to a pen, converting cubic to quadratic."""
    # Tokenize the path
    tokens = re.findall(r'([MmZzLlHhVvCcSsQqTtAa])|([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)', path_d)
    
    # Flatten tokens
    commands = []
    values = []
    for cmd, val in tokens:
        if cmd:
            commands.append(cmd)
            values.append([])
        else:
            values[-1].append(float(val))
    
    # Current position
    x, y = 0, 0
    cx, cy = 0, 0  # last control point for S/s
    qx, qy = 0, 0  # last control point for T/t
    start_x, start_y = 0, 0
    
    i = 0
    for cmd in commands:
        vals = values[i]
        i += 1
        
        if cmd == 'M':
            x, y = vals[0], vals[1]
            start_x, start_y = x, y
            pen.moveTo((x, y))
            for j in range(2, len(vals), 2):
                x, y = vals[j], vals[j+1]
                pen.lineTo((x, y))
        elif cmd == 'm':
            x, y = x + vals[0], y + vals[1]
            start_x, start_y = x, y
            pen.moveTo((x, y))
            for j in range(2, len(vals), 2):
                x, y = x + vals[j], y + vals[j+1]
                pen.lineTo((x, y))
        elif cmd == 'L':
            for j in range(0, len(vals), 2):
                x, y = vals[j], vals[j+1]
                pen.lineTo((x, y))
        elif cmd == 'l':
            for j in range(0, len(vals), 2):
                x, y = x + vals[j], y + vals[j+1]
                pen.lineTo((x, y))
        elif cmd == 'H':
            for v in vals:
                x = v
                pen.lineTo((x, y))
        elif cmd == 'h':
            for v in vals:
                x = x + v
                pen.lineTo((x, y))
        elif cmd == 'V':
            for v in vals:
                y = v
                pen.lineTo((x, y))
        elif cmd == 'v':
            for v in vals:
                y = y + v
                pen.lineTo((x, y))
        elif cmd == 'C':
            for j in range(0, len(vals), 6):
                x1, y1 = vals[j], vals[j+1]
                x2, y2 = vals[j+2], vals[j+3]
                x3, y3 = vals[j+4], vals[j+5]
                # Convert cubic to quadratic
                cx_val = (x1 + x2) / 2
                cy_val = (y1 + y2) / 2
                pen.qCurveTo((cx_val, cy_val), (x3, y3))
                cx, cy = x2, y2
                x, y = x3, y3
        elif cmd == 'c':
            for j in range(0, len(vals), 6):
                x1, y1 = x + vals[j], y + vals[j+1]
                x2, y2 = x + vals[j+2], y + vals[j+3]
                x3, y3 = x + vals[j+4], y + vals[j+5]
                cx_val = (x1 + x2) / 2
                cy_val = (y1 + y2) / 2
                pen.qCurveTo((cx_val, cy_val), (x3, y3))
                cx, cy = x2, y2
                x, y = x3, y3
        elif cmd == 'S':
            for j in range(0, len(vals), 4):
                x1, y1 = 2*x - cx, 2*y - cy
                x2, y2 = vals[j], vals[j+1]
                x3, y3 = vals[j+2], vals[j+3]
                cx_val = (x1 + x2) / 2
                cy_val = (y1 + y2) / 2
                pen.qCurveTo((cx_val, cy_val), (x3, y3))
                cx, cy = x2, y2
                x, y = x3, y3
        elif cmd == 's':
            for j in range(0, len(vals), 4):
                x1, y1 = 2*x - cx, 2*y - cy
                x2, y2 = x + vals[j], y + vals[j+1]
                x3, y3 = x + vals[j+2], y + vals[j+3]
                cx_val = (x1 + x2) / 2
                cy_val = (y1 + y2) / 2
                pen.qCurveTo((cx_val, cy_val), (x3, y3))
                cx, cy = x2, y2
                x, y = x3, y3
        elif cmd == 'Q':
            for j in range(0, len(vals), 4):
                qx, qy = vals[j], vals[j+1]
                x, y = vals[j+2], vals[j+3]
                pen.qCurveTo((qx, qy), (x, y))
        elif cmd == 'q':
            for j in range(0, len(vals), 4):
                qx, qy = x + vals[j], y + vals[j+1]
                x, y = x + vals[j+2], y + vals[j+3]
                pen.qCurveTo((qx, qy), (x, y))
        elif cmd == 'Z' or cmd == 'z':
            pen.closePath()
            x, y = start_x, start_y


def create_font():
    """Create a TTFont with all icons."""
    font = TTFont()
    
    glyph_order = ['.notdef'] + list(ICONS.keys())
    font.setGlyphOrder(glyph_order)
    
    # head table
    head = newTable('head')
    head.unitsPerEm = UNITS_PER_EM
    head.created = head.modified = 3600000000
    head.magicNumber = 0x5F0F3CF5
    head.flags = 0
    head.macStyle = 0
    head.fontRevision = 1.0
    head.lowestRecPPEM = 8
    head.indexToLocFormat = 0
    head.glyphDataFormat = 0
    head.xMin = 0
    head.yMin = -128
    head.xMax = 1024
    head.yMax = 896
    font['head'] = head
    
    # hhea table
    hhea = newTable('hhea')
    hhea.ascent = 896
    hhea.descent = -128
    hhea.lineGap = 0
    hhea.advanceWidthMax = 1024
    hhea.minLeftSideBearing = 0
    hhea.minRightSideBearing = 0
    hhea.xMaxExtent = 1024
    hhea.caretSlopeRise = 1
    hhea.caretSlopeRun = 0
    hhea.caretOffset = 0
    hhea.reserved0 = 0
    hhea.reserved1 = 0
    hhea.reserved2 = 0
    hhea.reserved3 = 0
    hhea.metricDataFormat = 0
    hhea.numberOfHMetrics = len(glyph_order)
    font['hhea'] = hhea
    
    # maxp table
    maxp = newTable('maxp')
    maxp.tableVersion = 0x00010000
    maxp.numGlyphs = len(glyph_order)
    maxp.maxPoints = 64
    maxp.maxContours = 4
    maxp.maxCompositePoints = 0
    maxp.maxCompositeContours = 0
    maxp.maxZones = 2
    maxp.maxTwilightPoints = 0
    maxp.maxStorage = 0
    maxp.maxFunctionDefs = 0
    maxp.maxInstructionDefs = 0
    maxp.maxStackElements = 0
    maxp.maxSizeOfInstructions = 0
    maxp.maxComponentElements = 0
    maxp.maxComponentDepth = 0
    font['maxp'] = maxp
    
    # glyf table
    glyf = newTable('glyf')
    glyf.glyphs = {}
    glyf.glyphOrder = glyph_order
    font['glyf'] = glyf
    
    # hmtx table
    hmtx = newTable('hmtx')
    hmtx.metrics = {}
    font['hmtx'] = hmtx
    
    # Create empty .notdef
    notdef_pen = TTGlyphPen(None)
    notdef_pen.moveTo((0, 0))
    notdef_pen.lineTo((0, 896))
    notdef_pen.lineTo((1024, 896))
    notdef_pen.lineTo((1024, 0))
    notdef_pen.closePath()
    glyf['.notdef'] = notdef_pen.glyph()
    hmtx.metrics['.notdef'] = (1024, 0)
    
    # Add icons
    for name, (code, path_d) in ICONS.items():
        try:
            pen = TTGlyphPen(None)
            parse_svg_path_to_pen(path_d, pen)
            glyf[name] = pen.glyph()
            hmtx.metrics[name] = (1024, 0)
        except Exception as e:
            print(f"  Warning: Failed to create glyph '{name}': {e}")
            empty_pen = TTGlyphPen(None)
            empty_pen.moveTo((0, 0))
            empty_pen.lineTo((1024, 896))
            empty_pen.lineTo((1024, 0))
            empty_pen.closePath()
            glyf[name] = empty_pen.glyph()
            hmtx.metrics[name] = (1024, 0)
    
    # cmap table
    cmap = newTable('cmap')
    from fontTools.ttLib.tables._c_m_a_p import CmapSubtable
    subtable = CmapSubtable.newSubtable(4)
    subtable.platformID = 3
    subtable.platEncID = 3
    subtable.language = 0
    subtable.cmap = {int(code, 16): name for name, (code, _) in ICONS.items()}
    cmap.table = subtable
    font['cmap'] = cmap
    
    # name table
    name_table = newTable('name')
    name_table.setName(FONT_FAMILY, 1, 3, 1, 1033)
    name_table.setName("Regular", 2, 3, 1, 1033)
    name_table.setName(f"{FONT_FAMILY} Regular", 4, 3, 1, 1033)
    name_table.setName(VERSION, 5, 3, 1, 1033)
    name_table.setName(FONT_FAMILY.replace(" ", ""), 6, 3, 1, 1033)
    font['name'] = name_table
    
    # OS/2 table
    from fontTools.ttLib.tables.O_S_2f_2 import Panose
    os2 = newTable('OS/2')
    os2.version = 4
    os2.xAvgCharWidth = 1024
    os2.usWeightClass = 400
    os2.usWidthClass = 5
    os2.fsType = 0
    os2.panose = Panose()
    os2.panose.bFamilyType = 5
    os2.panose.bSerifStyle = 0
    os2.panose.bWeight = 5
    os2.panose.bProportion = 0
    os2.panose.bContrast = 0
    os2.panose.bStrokeVariation = 0
    os2.panose.bArmStyle = 0
    os2.panose.bLetterForm = 0
    os2.panose.bMidline = 0
    os2.panose.bXHeight = 0
    os2.ySubscriptXSize = 650
    os2.ySubscriptYSize = 600
    os2.ySubscriptXOffset = 0
    os2.ySubscriptYOffset = 75
    os2.ySuperscriptXSize = 650
    os2.ySuperscriptYSize = 600
    os2.ySuperscriptXOffset = 0
    os2.ySuperscriptYOffset = 350
    os2.yStrikeoutSize = 50
    os2.yStrikeoutPosition = 300
    os2.sFamilyClass = 0
    os2.achVendID = 'KNSL'
    os2.fsSelection = 64
    os2.usFirstCharIndex = 0xE001
    os2.usLastCharIndex = 0xE014
    os2.sTypoAscender = 896
    os2.sTypoDescender = -128
    os2.sTypoLineGap = 0
    os2.usWinAscent = 896
    os2.usWinDescent = 128
    os2.ulCodePageRange1 = 0
    os2.ulCodePageRange2 = 0
    os2.sxHeight = 512
    os2.sCapHeight = 896
    os2.usDefaultChar = 0
    os2.usBreakChar = 32
    os2.usMaxContext = 0
    font['OS/2'] = os2
    
    # post table
    post = newTable('post')
    post.formatType = 2.0
    post.italicAngle = 0
    post.underlinePosition = -100
    post.underlineThickness = 50
    post.isFixedPitch = 0
    post.minMemType42 = 0
    post.maxMemType42 = 0
    post.minMemType1 = 0
    post.maxMemType1 = 0
    font['post'] = post
    
    # loca table
    loca = newTable('loca')
    font['loca'] = loca
    
    return font


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print(f"Building {FONT_FAMILY} v{VERSION}")
    print(f"Icons: {len(ICONS)}")
    print("-" * 40)
    
    font = create_font()
    
    # Save TTF
    ttf_path = os.path.join(script_dir, f"{FONT_NAME}.ttf")
    font.save(ttf_path)
    print(f"✓ TTF saved: {ttf_path}")
    
    # Save OTF
    otf_path = os.path.join(script_dir, f"{FONT_NAME}.otf")
    font.save(otf_path)
    print(f"✓ OTF saved: {otf_path}")
    
    print("-" * 40)
    print("Build complete!")
    print("\nTo create WOFF/WOFF2:")
    print("  pip install brotli")
    print(f"  fonttools ttLib.woff2 compress {ttf_path}")


if __name__ == "__main__":
    main()
