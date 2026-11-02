"use client";

import { useEffect, useRef } from "react";

import { SERVICE_IMAGE_FRAGMENT_SHADER } from "./service-image-shader";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/** Distorts the photo pixels on service changes and while the photo is hovered. */
export function ServiceImageEffect({ activeIndex }: { activeIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const context = gl;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, SERVICE_IMAGE_FRAGMENT_SHADER);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!program || !buffer || !texture) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const imageSize = gl.getUniformLocation(program, "u_imageSize");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const time = gl.getUniformLocation(program, "u_time");
    const strength = gl.getUniformLocation(program, "u_strength");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5 };
    let sourceSize = { width: 1, height: 1 };
    let imageReady = false;
    let hovered = false;
    let visible = false;
    let pulseUntil = 0;
    let frame = 0;
    let lastDraw = 0;
    let pendingImage: HTMLImageElement | null = null;

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const shouldRun = () => imageReady && visible && !document.hidden && !motion.matches
      && (hovered || performance.now() < pulseUntil);
    const draw = (now: number) => {
      frame = 0;
      if (!shouldRun()) {
        canvas.style.opacity = "0";
        return;
      }
      if (now - lastDraw >= 30) {
        lastDraw = now;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(imageSize, sourceSize.width, sourceSize.height);
        gl.uniform2f(pointerLocation, pointer.x, pointer.y);
        gl.uniform1f(time, now * 0.001);
        gl.uniform1f(strength, hovered ? 0.65 : Math.max(0, (pulseUntil - now) / 900));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.style.opacity = "1";
      }
      frame = window.requestAnimationFrame(draw);
    };
    const start = () => {
      if (shouldRun() && !frame) frame = window.requestAnimationFrame(draw);
    };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      start();
    };
    const updatePointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    const onEnter = (event: PointerEvent) => {
      hovered = true;
      updatePointer(event);
      start();
    };
    const onMove = (event: PointerEvent) => {
      updatePointer(event);
      start();
    };
    const onLeave = () => {
      hovered = false;
      if (performance.now() >= pulseUntil) canvas.style.opacity = "0";
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
        canvas.style.opacity = "0";
      } else start();
    };
    const onMotion = () => {
      if (motion.matches) {
        stop();
        canvas.style.opacity = "0";
      } else start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        stop();
        canvas.style.opacity = "0";
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(host);
    resizeObserver.observe(host);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);

    activateRef.current = () => {
      if (pendingImage) pendingImage.removeEventListener("load", uploadImage);
      imageReady = false;
      canvas.style.opacity = "0";
      const image = host.querySelector<HTMLImageElement>("img.is-active");
      if (!image) return;
      pendingImage = image;
      if (image.complete && image.naturalWidth) uploadImage();
      else image.addEventListener("load", uploadImage, { once: true });
    };

    function uploadImage() {
      if (!pendingImage?.naturalWidth) return;
      try {
        context.bindTexture(context.TEXTURE_2D, texture);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, pendingImage);
      } catch {
        return;
      }
      sourceSize = { width: pendingImage.naturalWidth, height: pendingImage.naturalHeight };
      imageReady = true;
      pointer.x = 0.5;
      pointer.y = 0.5;
      pulseUntil = performance.now() + 900;
      start();
    }

    return () => {
      activateRef.current = null;
      if (pendingImage) pendingImage.removeEventListener("load", uploadImage);
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    activateRef.current?.();
  }, [activeIndex]);

  return <canvas ref={canvasRef} className="service-section-image-effect [position:absolute] [inset:0] [z-index:1] [width:100%] [height:100%] [opacity:0] [pointer-events:none] [transition:opacity_180ms_linear] motion-reduce:[display:none]" aria-hidden="true" />;
}
