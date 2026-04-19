import { Input } from "@fluentui/react-components";

export const Period = ({
  period,
  setPeriod,
}: {
  period: number;
  setPeriod: (period: number) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: "4px", fontSize: "12px", fontWeight: "bold" }}>Step:</span>
      <Input
        type="number"
        value={period.toString()}
        onChange={(e, data) => setPeriod(Number(data.value))}
        style={{
          width: "54px",
        }}
        size="small"
      />
    </div>
  );
};
