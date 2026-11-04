"""Render the three aligned Step 05 concept-design states with Blender 5.x.

Run from the repository root:
  /Applications/Blender.app/Contents/MacOS/Blender -b -t 4 --python scripts/render-concept-design.py
"""

from pathlib import Path
import math
import random

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "sandbox" / "concept-design"
SOURCE = ROOT / "assets" / "sandbox" / "concept-design.blend"
OUTPUT.mkdir(parents=True, exist_ok=True)
SOURCE.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def material(name, color, roughness=0.82, metallic=0, transmission=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get("Principled BSDF")
    node.inputs["Base Color"].default_value = (*color, 1)
    node.inputs["Roughness"].default_value = roughness
    node.inputs["Metallic"].default_value = metallic
    node.inputs["Transmission Weight"].default_value = transmission
    return mat


clay = material("warm white study card", (0.76, 0.75, 0.72))
plaster = material("warm mineral plaster", (0.78, 0.76, 0.71))
stone = material("pale concrete", (0.48, 0.47, 0.44))
roof_mat = material("chalk roof", (0.67, 0.65, 0.60))
glass = material("smoked architectural glass", (0.25, 0.27, 0.27), 0.08, 0, 0.48)
timber = material("muted oak", (0.52, 0.49, 0.44))
earth = material("neutral landscape", (0.27, 0.27, 0.25))
foliage = material("graphite foliage", (0.18, 0.19, 0.18))
trunk = material("weathered bark", (0.40, 0.39, 0.36))
plan_mat = material("plan ink", (0.68, 0.68, 0.65))

for mat in (plaster, stone, roof_mat, timber, earth):
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 85 if mat != earth else 35
    noise.inputs["Detail"].default_value = 2
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.075
    bump.inputs["Distance"].default_value = 0.025
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], nodes.get("Principled BSDF").inputs["Normal"])


def collection(name):
    group = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(group)
    return group


plan = collection("01 sketch")
shape = collection("02 shape")
concept = collection("03 concept")


def move_to(obj, group):
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    group.objects.link(obj)
    return obj


def box(name, location, scale, mat, group, bevel=0.015):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = move_to(bpy.context.object, group)
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("softened edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        obj.modifiers.new("weighted normals", "WEIGHTED_NORMAL")
    obj.data.materials.append(mat)
    return obj


def stroke(name, points, mat, group, radius=0.008, close=False):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.resolution_u = 3
    curve.bevel_resolution = 2
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, coords in zip(spline.points, points):
        point.co = (*coords, 1)
    spline.use_cyclic_u = close
    obj = bpy.data.objects.new(name, curve)
    group.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def outline(name, x1, y1, x2, y2, z=0.04, radius=0.007):
    return stroke(name, [(x1, y1, z), (x2, y1, z), (x2, y2, z), (x1, y2, z)], plan_mat, plan, radius, True)


def roof(name, front, mat, group, rise=0):
    y1, y2 = (-2.53, 0) if front else (0, 2.53)
    z1, z2 = (2.43, 3.13) if front else (3.13, 2.43)
    verts = [(-3.35, y1, z1 + rise), (3.35, y1, z1 + rise), (3.35, y2, z2 + rise), (-3.35, y2, z2 + rise)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], [(0, 1, 2, 3)])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    group.objects.link(obj)
    obj.data.materials.append(mat)
    solid = obj.modifiers.new("roof thickness", "SOLIDIFY")
    solid.thickness = 0.12
    bevel = obj.modifiers.new("roof edge", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 2
    obj.modifiers.new("roof normals", "WEIGHTED_NORMAL")
    return obj


# Exact footprint and furniture positions are shared by all three states.
outline("outer plan", -3.0, -2.2, 3.0, 2.2, radius=0.015)
outline("living room", -2.85, -2.05, -0.15, 2.05)
outline("bedroom", -0.05, 0.12, 2.85, 2.05)
stroke("hall division", [(-0.12, -2.2, 0.04), (-0.12, 2.2, 0.04)], plan_mat, plan)
stroke("bath division", [(1.15, 0.12, 0.04), (1.15, 2.2, 0.04)], plan_mat, plan)
outline("sofa", -2.55, -1.3, -1.65, 0.22)
outline("living table", -1.52, -0.93, -0.67, -0.16)
outline("kitchen island", -2.44, 1.16, -1.43, 1.65)
outline("dining table", -0.64, -1.54, 0.42, -0.68)
outline("bed", 1.18, 0.47, 2.65, 1.7)
for x in (-2.55, -1.8, 0.6, 2.3):
    stroke("dimension tick", [(x, -2.39, 0.03), (x, -2.27, 0.03)], plan_mat, plan, 0.004)
stroke("dimension baseline", [(-3.0, -2.35, 0.03), (3.0, -2.35, 0.03)], plan_mat, plan, 0.004)


def make_house(group, finished=False):
    main = plaster if finished else clay
    slab = stone if finished else clay
    furnishing = timber if finished else clay
    box("foundation slab", (0, 0, -0.12), (6.35, 4.65, 0.24), slab, group, 0.025)
    box("back wall", (0, 2.15, 1.18), (6.05, 0.17, 2.36), main, group)
    box("west wall", (-2.96, 0, 1.18), (0.17, 4.28, 2.36), main, group)
    box("east wall back", (2.96, 1.42, 1.18), (0.17, 1.45, 2.36), main, group)
    box("east wall front", (2.96, -1.76, 1.18), (0.17, 0.79, 2.36), main, group)
    box("front wall left", (-2.65, -2.15, 1.18), (0.65, 0.17, 2.36), main, group)
    box("front wall center", (0.15, -2.15, 1.18), (0.18, 0.17, 2.36), main, group)
    box("front wall right", (2.78, -2.15, 1.18), (0.45, 0.17, 2.36), main, group)
    box("front header", (0, -2.15, 2.22), (6.0, 0.18, 0.25), main, group)
    box("bedroom partition", (0.55, 1.12, 0.98), (0.13, 2.0, 1.96), main, group)
    box("room partition", (1.28, 0.15, 1.05), (3.31, 0.13, 2.1), main, group)
    box("bath partition", (1.3, 1.13, 0.96), (0.13, 2.05, 1.92), main, group)
    box("living sofa", (-2.16, -0.52, 0.31), (0.73, 1.65, 0.48), furnishing, group, 0.06)
    box("sofa back", (-2.56, -0.52, 0.57), (0.16, 1.65, 0.60), furnishing, group, 0.05)
    box("coffee table", (-1.22, -0.57, 0.26), (0.86, 0.65, 0.08), slab, group)
    box("kitchen island", (-1.92, 1.42, 0.46), (1.1, 0.54, 0.92), furnishing, group)
    box("dining table", (-0.12, -1.12, 0.54), (1.14, 0.73, 0.10), furnishing, group)
    box("bed platform", (2.03, 1.25, 0.25), (1.47, 1.22, 0.37), furnishing, group, 0.05)
    box("bed mattress", (2.03, 1.25, 0.49), (1.36, 1.13, 0.13), clay, group, 0.04)
    roof("north roof plane", False, roof_mat if finished else clay, group, 0.03 if finished else 0.25)
    if finished:
        roof("south roof plane", True, roof_mat, group, 0.03)
        box("front glass living", (-1.23, -2.15, 1.09), (2.07, 0.022, 1.96), glass, group, 0.005)
        box("front glass dining", (1.56, -2.15, 1.09), (2.24, 0.022, 1.96), glass, group, 0.005)
        box("east glazing", (2.96, -0.45, 1.12), (0.022, 2.17, 1.92), glass, group, 0.005)
        for x in (-2.17, -0.35, 0.95, 2.32):
            box("window mullion", (x, -2.21, 1.1), (0.035, 0.04, 1.94), stone, group, 0.004)
        box("stone threshold", (0, -2.62, -0.07), (5.78, 0.60, 0.1), stone, group, 0.01)


make_house(shape)
make_house(concept, finished=True)
box("site base", (0.12, 0.05, -0.24), (7.55, 5.65, 0.22), earth, concept, 0.035)
for i in range(5):
    box("entry paver", (1.35 + i * 0.58, -2.93, -0.09), (0.45, 0.43, 0.045), stone, concept, 0.008)


def branch(name, start, end, radius):
    middle = (Vector(start) + Vector(end)) / 2
    direction = Vector(end) - Vector(start)
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=radius, depth=direction.length, location=middle)
    obj = move_to(bpy.context.object, concept)
    obj.name = name
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    obj.data.materials.append(trunk)


random.seed(13)
tree_x, tree_y = 3.35, -1.55
branch("tree trunk", (tree_x, tree_y, -0.08), (tree_x, tree_y, 2.75), 0.085)
for i in range(16):
    angle = i * math.tau / 16
    radius = 0.36 + random.random() * 0.54
    end = (tree_x + math.cos(angle) * radius, tree_y + math.sin(angle) * radius * 0.75, 2.84 + random.random() * 0.48)
    branch("tree branch", (tree_x, tree_y, 2.05), end, 0.018)
    for _ in range(4):
        leaf_center = (end[0] + random.uniform(-0.18, 0.18), end[1] + random.uniform(-0.16, 0.16), end[2] + random.uniform(-0.18, 0.18))
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=random.uniform(0.13, 0.22), location=leaf_center)
        obj = move_to(bpy.context.object, concept)
        obj.name = "neutral foliage"
        obj.scale = (1.16, 1.04, 0.78)
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
        obj.data.materials.append(foliage)


world = bpy.context.scene.world
world.color = (0.25, 0.25, 0.25)
world.use_nodes = True
world.node_tree.nodes.get("Background").inputs["Color"].default_value = (0.36, 0.36, 0.36, 1)
world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.8


def area(name, location, energy, size):
    data = bpy.data.lights.new(name, "AREA")
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector((0, 0, 0.5)) - obj.location).to_track_quat("-Z", "Y").to_euler()
    data.energy = energy
    data.shape = "DISK"
    data.size = size


area("large softbox", (0, -6, 10), 1150, 7)
area("rim softbox", (-6, 3, 7), 680, 6)

camera_data = bpy.data.cameras.new("isometric orthographic camera")
camera = bpy.data.objects.new("isometric orthographic camera", camera_data)
bpy.context.scene.collection.objects.link(camera)
camera.location = (9, -11, 9)
camera.rotation_euler = (Vector((0, 0, 1.05)) - camera.location).to_track_quat("-Z", "Y").to_euler()
camera_data.type = "ORTHO"
camera_data.ortho_scale = 10.3
bpy.context.scene.camera = camera

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"

for group in (plan, shape, concept):
    group.hide_render = True

for index, (group, filename) in enumerate(((plan, "sketch.png"), (shape, "shape.png"), (concept, "concept.png"))):
    group.hide_render = False
    scene.render.filepath = str(OUTPUT / filename)
    bpy.ops.render.render(write_still=True)
    group.hide_render = True
    print(f"Rendered {index + 1}/3: {scene.render.filepath}")

plan.hide_render = True
shape.hide_render = True
concept.hide_render = False
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE))
print(f"Saved editable source: {SOURCE}")
