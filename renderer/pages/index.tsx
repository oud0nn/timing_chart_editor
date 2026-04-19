import React, { useEffect, useRef, useState } from "react";
import { NameModal } from "@/components/chart/NameModal";

import {
  CELL_HEIGHT,
  CELL_WIDTH,
  NAME_DATA_DEFAULT,
  SIGNAL_TYPE_DEFAULT,
  CHART_DATA_DEFAULT,
  PERIOD_DEFAULT,
} from "@/utils/draw/variable";

import { getLongestRowIndex, getLongestNameIndex } from "@/utils/draw/util";

import { drawChart, drawGrid, drawName, drawScale } from "@/utils/draw/draw";

import { Period } from "@/components/PeriodInput";

import {
  Input,
  Label,
  Button,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    ...shorthands.border("1px", "solid", "#e0e0e0"),
  },
  header: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "10px 20px",
    borderBottom: "1px solid #e0e0e0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  mainLayout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 56px)",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "max-content minmax(0, 1fr)",
    gridTemplateRows: "max-content 1fr",
    alignItems: "start",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px",
    gap: "0",
  },
  nameCanvasArea: {
    overflow: "hidden",
    gridColumn: "1 / 2",
    gridRow: "2 / 3",
  },
  chartCanvasArea: {
    overflowX: "auto",
    overflowY: "hidden",
    gridColumn: "2 / 3",
    gridRow: "2 / 3",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderTop: "1px solid #e0e0e0",
    borderRight: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
  },
  addButton: {
    width: "100%",
    marginTop: "4px",
  }
});

export default function ChartPage() {
  const styles = useStyles();

  const nameCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  const [nameData, setNameData] = useState<NameData[]>(NAME_DATA_DEFAULT);
  const [signalType, setSignalType] =
    useState<SignalType[]>(SIGNAL_TYPE_DEFAULT);
  const [chartData, setChartData] = useState<ChartData[][]>(CHART_DATA_DEFAULT);
  const [period, setPeriod] = useState<number>(PERIOD_DEFAULT);

  const tmpnameWidth = 12 * nameData[getLongestNameIndex(nameData)].length + 20;
  const nameWidth = tmpnameWidth < 120 ? 120 : tmpnameWidth;

  const chartWidth =
    CELL_WIDTH * chartData[getLongestRowIndex(chartData)].length;

  const chartHeight = CELL_HEIGHT * chartData.length + CELL_HEIGHT;

  const handleSave = async () => {
    const data = {
      nameData,
      signalType,
      chartData,
    };
    try {
      const result = await (window as any).electron.saveJson(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoad = async () => {
    try {
      const result = await (window as any).electron.loadJson();
      if (result.success && result.data) {
        const validatedChartData = result.data.chartData.map(
          (row: ChartData[]) => {
            if (row.length === 0 || row[row.length - 1] !== "") {
              return [...row, ""];
            }
            return row;
          },
        );

        setNameData(result.data.nameData);
        setSignalType(result.data.signalType);
        setChartData(validatedChartData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      drawGrid(ctx, chartWidth, chartHeight);
      drawScale(ctx, chartWidth, CELL_HEIGHT, period);
      drawChart(ctx, chartData, signalType, CELL_HEIGHT);
    };

    document.fonts.ready.then(render);
  }, [chartData, nameData, period, signalType, chartWidth, chartHeight]);

  useEffect(() => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      drawName(ctx, nameData, CELL_HEIGHT, nameWidth, chartHeight);
    };

    document.fonts.ready.then(render);
  }, [nameData, nameWidth, chartHeight]);

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNameValue, setNameEditingValue] = useState<NameData>("");
  const [editingSignalTypeValue, setEditingSignalTypeValue] =
    useState<SignalType>("data");

  const handleNameMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const row = Math.floor((mouseY - CELL_HEIGHT) / CELL_HEIGHT);

    if (row < 0 || row >= nameData.length) return;

    if (row >= 0 && row < nameData.length) {
      setEditingIndex(row);
      setNameEditingValue(nameData[row]);
      setEditingSignalTypeValue(signalType[row]);
      setIsNameModalOpen(true);
    }
  };

  const addNewSignal = () => {
    const newNameData = [...nameData];
    const newSignalTypeData = [...signalType];
    const newChartData = [...chartData];
    newNameData.push("NEW_DATA");
    newSignalTypeData.push("data");
    newChartData.push([0]);
    setNameData(newNameData);
    setSignalType(newSignalTypeData);
    setChartData(newChartData);
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  const handleChartMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / CELL_WIDTH);
    const row = Math.floor((mouseY - CELL_HEIGHT) / CELL_HEIGHT);

    if (row < 0 || row >= chartData.length) return;

    const newData = [...chartData];
    newData[row] = [...newData[row]];
    newData[row][col] =
      newData[row][col] === 0
        ? 1
        : newData[row][col] === 1
          ? "x"
          : newData[row][col] === "x" && col === newData[row].length - 2
            ? ""
            : 0;

    if (col === newData[row].length - 1 && "" !== newData[row][col]) {
      newData[row].push("");
    } else if (col === newData[row].length - 2 && "" === newData[row][col]) {
      newData[row].pop();
    }
    setChartData(newData);
  };

  return (
    <>
      <header className={styles.header}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', marginRight: 'auto' }}>
          Timing Chart Editor
        </div>
        <Button
          appearance="primary"
          icon={<SaveIcon />}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          appearance="secondary"
          icon={<FolderOpenIcon />}
          onClick={handleLoad}
        >
          Load
        </Button>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.chartGrid}>
          <div className={styles.nameCanvasArea}>
            <div className={styles.container}>
              <div style={{ position: 'absolute', top: '2px', left: '4px', zIndex: 10 }}>
                <Period period={period} setPeriod={setPeriod} />
              </div>
              <canvas
                ref={nameCanvasRef}
                width={nameWidth}
                height={chartHeight}
                onMouseDown={handleNameMouseDown}
                style={{ cursor: "pointer" }}
              />
            </div>
            <Button
              className={styles.addButton}
              appearance="subtle"
              icon={<AddIcon />}
              onClick={addNewSignal}
            >
              Add Signal
            </Button>
          </div>
          <div className={styles.chartCanvasArea}>
            <canvas
              ref={chartCanvasRef}
              width={chartWidth}
              height={chartHeight}
              onMouseDown={handleChartMouseDown}
              style={{
                cursor: "crosshair",
              }}
            />
          </div>
        </div>
      </div>
      {isNameModalOpen && (
        <NameModal
          nameData={nameData}
          setNameData={setNameData}
          signalType={signalType}
          setSignalType={setSignalType}
          chartData={chartData}
          setChartData={setChartData}
          setIsNameModalOpen={setIsNameModalOpen}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          editingNameValue={editingNameValue}
          setNameEditingValue={setNameEditingValue}
          editingSignalTypeValue={editingSignalTypeValue}
          setEditingSignalTypeValue={setEditingSignalTypeValue}
        />
      )}
    </>
  );
}
