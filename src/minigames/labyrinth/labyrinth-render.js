// Drawing the labyrinth from above: sandstone floor, stone walls, sealed doors, Ariadne's thread and torchlight.
(function (LM) {
  'use strict';

  const P = LM.palette;
  const D = LM.draw;
  const TILE = 44;
  const PLAY_TOP = 56;
  const PLAY_HEIGHT = 608;

  function layoutFor(maze) {
    return {
      tile: TILE,
      left: Math.round((1280 - maze.width * TILE) / 2),
      top: PLAY_TOP + Math.round((PLAY_HEIGHT - maze.height * TILE) / 2),
    };
  }

  // position: a tile, or a point between tiles while walking ({ x, y } in tile units).
  function tileCenter(layout, position) {
    return { x: layout.left + position.x * TILE + TILE / 2, y: layout.top + position.y * TILE + TILE / 2 };
  }

  function drawWallTile(ctx, x, y) {
    ctx.fillStyle = '#4a3c30';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#6e5c48';
    ctx.fillRect(x, y, TILE, 8);
    ctx.fillStyle = '#3a2e24';
    ctx.fillRect(x + TILE / 2 - 1, y + 12, 2, TILE - 16);
  }

  function drawMaze(ctx, maze, layout) {
    D.drawBandedGradient(ctx, { x: 0, y: PLAY_TOP, width: 1280, height: PLAY_HEIGHT }, '#2a2018', '#140e0a', 6);
    for (let y = 0; y < maze.height; y += 1) {
      for (let x = 0; x < maze.width; x += 1) {
        const left = layout.left + x * TILE;
        const top = layout.top + y * TILE;
        if (maze.tiles[y][x] === LM.maze.WALL) {
          drawWallTile(ctx, left, top);
        } else {
          ctx.fillStyle = (x + y) % 2 === 0 ? '#c8a878' : '#bf9e6e';
          ctx.fillRect(left, top, TILE, TILE);
        }
      }
    }
  }

  function drawThread(ctx, layout, tiles, extraPoint) {
    const points = tiles.map(function (tile) { return tileCenter(layout, tile); });
    if (extraPoint) {
      points.push(extraPoint);
    }
    if (points.length < 2) {
      return;
    }
    [[10, 'rgba(255, 80, 60, 0.25)'], [4, '#e8282a']].forEach(function (stroke) {
      ctx.beginPath();
      ctx.moveTo(points[0].x - TILE / 2, points[0].y);
      points.forEach(function (point) { ctx.lineTo(point.x, point.y); });
      ctx.lineWidth = stroke[0];
      ctx.strokeStyle = stroke[1];
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }

  function drawSealedDoor(ctx, layout, tile, time) {
    const center = tileCenter(layout, tile);
    D.drawOutlinedRoundRect(ctx, { x: center.x - TILE / 2 + 3, y: center.y - TILE / 2 + 3, width: TILE - 6, height: TILE - 6 }, 5, '#8a5a2a', 2.5);
    const glow = 0.3 + 0.2 * Math.sin(time * 4);
    D.fillCircle(ctx, center.x, center.y, 18, 'rgba(255, 216, 74, ' + glow + ')');
    D.drawOutlinedCircle(ctx, center.x, center.y, 12, P.gold, 2.5);
    LM.text.drawTextLine(ctx, '?', center.x, center.y + 7, { font: LM.text.boldFont(18), color: '#7a3a10', align: 'center' });
  }

  function drawBullEmblem(ctx, layout, tile, time) {
    const center = tileCenter(layout, tile);
    D.fillCircle(ctx, center.x, center.y, 24 + Math.sin(time * 3) * 2, 'rgba(200, 40, 26, 0.35)');
    D.drawOutlinedCircle(ctx, center.x, center.y + 4, 11, '#a82a1a', 2);
    D.drawOutlinedPolygon(ctx, [[center.x - 9, center.y - 2], [center.x - 18, center.y - 16], [center.x - 4, center.y - 8]], '#f2e6c8', 2);
    D.drawOutlinedPolygon(ctx, [[center.x + 9, center.y - 2], [center.x + 18, center.y - 16], [center.x + 4, center.y - 8]], '#f2e6c8', 2);
  }

  function drawHeroFromAbove(ctx, point, facingAngle) {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(facingAngle);
    D.drawOutlinedPolygon(ctx, [[-14, -10], [-14, 10], [-2, 14], [-2, -14]], '#7a1a12', 2);
    D.drawOutlinedEllipse(ctx, 0, 0, 10, 14, '#d8382a', 2);
    D.drawLine(ctx, 6, 10, 20, 12, '#dfe6ee', 4);
    D.drawOutlinedCircle(ctx, 2, 0, 9, P.skin, 2);
    [-4, 0, 4].forEach(function (curlY) { D.drawOutlinedCircle(ctx, -2, curlY, 4, '#6b3e17', 1); });
    ctx.restore();
  }

  function drawMinotaurFromAbove(ctx, point, facingAngle) {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(facingAngle);
    D.drawOutlinedEllipse(ctx, -2, 0, 14, 18, '#6a3a1a', 2.5);
    D.drawOutlinedCircle(ctx, 6, 0, 10, '#8a5a2a', 2);
    D.drawOutlinedPolygon(ctx, [[8, -8], [14, -22], [4, -10]], '#f2e6c8', 2);
    D.drawOutlinedPolygon(ctx, [[8, 8], [14, 22], [4, 10]], '#f2e6c8', 2);
    ctx.restore();
  }

  // Everything outside the torchlight sinks into darkness; radius in pixels.
  function drawDarkness(ctx, light, radius) {
    const gradient = ctx.createRadialGradient(light.x, light.y, radius * 0.35, light.x, light.y, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(8, 6, 12, 0.55)');
    gradient.addColorStop(1, 'rgba(8, 6, 12, 0.94)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, PLAY_TOP, 1280, PLAY_HEIGHT);
  }

  function drawGlowingEyes(ctx, point, time) {
    const pulse = 0.7 + 0.3 * Math.sin(time * 6);
    [-6, 6].forEach(function (offset) {
      D.fillCircle(ctx, point.x + offset, point.y - 4, 6, 'rgba(255, 40, 20, ' + (0.3 * pulse) + ')');
      D.fillCircle(ctx, point.x + offset, point.y - 4, 2.5, '#ff4a2a');
    });
  }

  LM.labyrinthRender = {
    TILE,
    layoutFor,
    tileCenter,
    drawMaze,
    drawThread,
    drawSealedDoor,
    drawBullEmblem,
    drawHeroFromAbove,
    drawMinotaurFromAbove,
    drawDarkness,
    drawGlowingEyes,
  };
}(window.LM = window.LM || {}));
