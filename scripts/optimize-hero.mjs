import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';

// Preserve frame rate, duration and packed-channel layout used by the shader.
for (const [name, crf] of [['packed-pingpong', 25], ['source-pingpong', 28]]) {
  const input = `public/media/mandrill/${name}.mp4`;
  const output = `public/media/mandrill/${name}-optimized.mp4`;
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-map', '0:v:0', '-an', '-c:v', 'libx264', '-preset', 'slow',
    '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output,
  ], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg failed for ${input}`);
  console.log(`${name}: ${statSync(input).size} → ${statSync(output).size} bytes`);
}
