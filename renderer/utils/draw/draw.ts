
import {
  drawClockCell0,
  drawClockCell1,
  drawClockCellx,
} from "@/utils/draw/clock";

import {
  drawDataCell0to1,
  drawDataCell0to0,
  drawDataCell0tox,
  drawDataCellxto0,
  drawDataCell1to0,
  drawDataCell1to1,
  drawDataCell1tox,
  drawDataCellxto1,
  drawDataCellxtox,
} from "@/utils/draw/data";

import {
  CELL_HEIGHT,
  CELL_WIDTH,
} from "@/utils/draw/variable";

export const drawChart = (
  ctx: CanvasRenderingContext2D,
  chartData: ChartData[][],
  signalType: SignalType[],
  currentY: number,
  // width: number,
  // height: number
) => {
  // drawGrid(ctx, width, height);

  for (let i = 0; i <= chartData.length; i++) {
    const y = i * CELL_HEIGHT + currentY;

    if ("clock" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        const x = j * CELL_WIDTH;

        if (0 === chartData[i][j]) {
          drawClockCell0(ctx, x, y);
        } else if (1 === chartData[i][j]) {
          drawClockCell1(ctx, x, y);
        } else if ("x" === chartData[i][j]) {
          drawClockCellx(ctx, x, y);
        }
      }
    } else if ("data" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        const x = j * CELL_WIDTH;

        if (0 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto0(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to0(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to0(ctx, x, y);
          }
        } else if (1 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto1(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to1(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to1(ctx, x, y);
          }
        } else if ("x" === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxtox(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0tox(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1tox(ctx, x, y);
          }
        }
      }
    }
  }
};

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  for (let x = CELL_WIDTH; x <= width; x += CELL_WIDTH) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += CELL_HEIGHT) {
    if (CELL_HEIGHT === y) {
      ctx.strokeStyle = "#b9b3b3ff";
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
    }

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawName = (
  ctx: CanvasRenderingContext2D,
  nameData: string[],
  currentY: number,
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.font = "18px SourceHanCodeJP-Normal";
  ctx.fillStyle = "#000";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  for (let i = 0; i < nameData.length; i++) {
    ctx.fillText(nameData[i], 5, i * CELL_HEIGHT + CELL_HEIGHT / 2 + currentY);
  }
};

export const drawScale = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  period: number,
) => {
  // ctx.clearRect(0, 0, width, height);

  ctx.font = "14px SourceHanCodeJP-Normal";
  ctx.fillStyle = "#000";
  // ctx.strokeStyle = "#e0e0e0";
  // ctx.strokeStyle = "#ec3f3fff";
  // ctx.lineWidth = 0.8;

  for (let i = 0; i <= width / CELL_WIDTH; i++) {
    if (i < width / CELL_WIDTH) {
      ctx.fillText(
        (i * period).toString(),
        i * CELL_WIDTH + 2,
        height - 5,
        CELL_WIDTH - 2,
      );
    }
  }
};
