/** Image-only displacement: smoke-like flow and a small cursor ripple. */
export const SERVICE_IMAGE_FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_imageSize;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_strength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x),
    f.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 point = vec2((uv.x - u_pointer.x) * aspect, uv.y - u_pointer.y);
  float distanceToPointer = length(point);
  float influence = 1.0 - smoothstep(0.05, 0.8, distanceToPointer);

  vec2 flow = vec2(
    noise(uv * 5.0 + vec2(u_time * 0.24, -u_time * 0.18)),
    noise(uv * 5.0 + vec2(-u_time * 0.16, u_time * 0.22) + 18.0)
  ) - 0.5;
  float ripple = sin(distanceToPointer * 29.0 - u_time * 9.0)
    * exp(-distanceToPointer * 5.0);
  vec2 direction = point / max(distanceToPointer, 0.001);
  direction.x /= aspect;
  vec2 displaced = uv + u_strength * (
    flow * (0.014 + 0.018 * influence)
    + direction * ripple * influence * 0.012
  );

  float imageAspect = u_imageSize.x / u_imageSize.y;
  vec2 cover = vec2(1.0);
  if (imageAspect > aspect) cover.x = aspect / imageAspect;
  else cover.y = imageAspect / aspect;
  vec2 imageUv = (displaced - 0.5) * cover + 0.5;
  gl_FragColor = texture2D(u_image, clamp(imageUv, 0.0, 1.0));
}`;
