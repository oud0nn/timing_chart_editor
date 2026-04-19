import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Select,
  makeStyles
} from '@fluentui/react-components';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  arrows: {
    display: "flex",
    flexDirection: "column",
  }
});

export const NameModal = ({
  nameData,
  setNameData,
  signalType,
  setSignalType,
  chartData,
  setChartData,
  setIsNameModalOpen,
  editingIndex,
  setEditingIndex,
  editingNameValue,
  setNameEditingValue,
  editingSignalTypeValue,
  setEditingSignalTypeValue,
}: any) => {
  const styles = useStyles();

  const saveNameEdit = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      newNameData[editingIndex] = editingNameValue;
      newSignalTypeData[editingIndex] = editingSignalTypeValue;
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
    }
  };

  const deleteSignal = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];
      newNameData.splice(editingIndex, 1);
      newSignalTypeData.splice(editingIndex, 1);
      newChartData.splice(editingIndex, 1);
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
    }
  };

  const moveSignalUp = () => {
    if (editingIndex !== null && editingIndex > 0) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      [newNameData[editingIndex], newNameData[editingIndex - 1]] = [
        newNameData[editingIndex - 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex - 1]] = [
        newSignalTypeData[editingIndex - 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex - 1]] = [
        newChartData[editingIndex - 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveSignalDown = () => {
    if (editingIndex !== null && editingIndex < nameData.length - 1) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      [newNameData[editingIndex], newNameData[editingIndex + 1]] = [
        newNameData[editingIndex + 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex + 1]] = [
        newSignalTypeData[editingIndex + 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex + 1]] = [
        newChartData[editingIndex + 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex + 1);
    }
  };

  const cancelNameEdit = () => {
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  return (
    <Dialog open={true} onOpenChange={(e, data) => !data.open && cancelNameEdit()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Edit Signal</DialogTitle>
          <DialogContent className={styles.container}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Signal Name</label>
              <div className={styles.row}>
                <div className={styles.arrows}>
                  <Button
                    icon={<ArrowDropUpIcon />}
                    appearance="subtle"
                    onClick={moveSignalUp}
                    disabled={editingIndex === 0}
                    size="small"
                  />
                  <Button
                    icon={<ArrowDropDownIcon />}
                    appearance="subtle"
                    onClick={moveSignalDown}
                    disabled={editingIndex === nameData.length - 1}
                    size="small"
                  />
                </div>
                <Input
                  value={editingNameValue}
                  onChange={(e, data) => setNameEditingValue(data.value)}
                  style={{ flexGrow: 1 }}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Signal Type</label>
              <Select
                value={editingSignalTypeValue}
                onChange={(e, data) => setEditingSignalTypeValue(data.value)}
                style={{ width: '100%' }}
              >
                <option value="data">Data</option>
                <option value="clock">Clock</option>
              </Select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" style={{ color: "#ff0051ff" }} onClick={deleteSignal}>
              Delete Signal
            </Button>
            <Button appearance="secondary" onClick={cancelNameEdit}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={saveNameEdit}>
              Save
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
