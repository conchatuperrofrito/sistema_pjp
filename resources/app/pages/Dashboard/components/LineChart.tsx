import { useState, FC, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Spinner
} from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReportByPeriod } from "@/services/dashboardService";
import { SlidersIcon } from "@/assets/icons";

const TIME_PERIOD_OPTIONS = [
  {
    key: "today",
    label: "último día"
  },
  {
    key: "week",
    label: "última semana"
  },
  {
    key: "month",
    label: "último mes"
  },
  {
    key: "year",
    label: "último año"
  }
];

const SEX_OPTIONS = [
  {
    key: "",
    label: "Todos"
  },
  {
    key: "Masculino",
    label: "Masculino"
  },
  {
    key: "Femenino",
    label: "Femenino"
  },
  {
    key: "Unassigned",
    label: "Sin asignar"
  }
];

const GROUP_BY_OPTIONS = [
  {
    key: "specialty",
    label: "Especialidad"
  },
  {
    key: "status",
    label: "Estado"
  }
];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  isAdmin: boolean;
}

const LineChart: FC<LineChartProps> = ({ isAdmin }) => {

  const [timePeriod, setTimePeriod] = useState("today");
  const [selectedSex, setSelectedSex] = useState("");
  const [groupBy, setGroupBy] = useState(isAdmin ? "specialty" : "status");

  const { data, isFetching } = useQuery({
    queryKey: [
      "reportData",
      timePeriod,
      selectedSex,
      groupBy
    ],
    queryFn: () =>
      getReportByPeriod({
        period: timePeriod,
        sex: selectedSex,
        groupBy: groupBy
      }),
    placeholderData: keepPreviousData
  });

  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: data?.datasets.map((dataset, index) => {
        const statusColors: Record<string, string> = {
          Cancelada: "hsl(0, 70%, 50%)",
          Pendiente: "hsl(60, 70%, 50%)",
          Realizada: "hsl(120, 70%, 50%)",
          Programada: "hsl(180, 70%, 50%)"
        };
        const color =
          groupBy === "specialty"
            ? `hsl(${(index * 60) % 360}, 70%, 50%)`
            : statusColors[dataset.label as keyof typeof statusColors] ||
              `hsl(${(index * 60) % 360}, 70%, 50%)`;
        return {
          ...dataset,
          borderColor: color,
          backgroundColor: `${color}33`,
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color
        };
      }) || []
    };
  }, [data, groupBy]);

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between flex-col sm:flex-row gap-y-1 mb-1">
          <h2 className="text-lg font-semibold">Citas resgistadas por periodo</h2>
          <div className="flex items-center justify-end">
            <Select
              label="Periodo"
              selectedKeys={[timePeriod]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimePeriod(e.target.value ? e.target.value : timePeriod)}
              isLoading={isFetching}
              size="sm"
              className="mr-1"
              classNames={{
                base: "w-[150px]"
              }}
            >
              {TIME_PERIOD_OPTIONS.map(option => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            {
              isAdmin && (
                <Select
                  label="Agrupar por"
                  selectedKeys={[groupBy]}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGroupBy(e.target.value)}
                  isDisabled={isFetching}
                  size="sm"
                  className="mr-1"
                  classNames={{
                    base: "w-[170px]"
                  }}
                  items={GROUP_BY_OPTIONS}
                >
                  {(groupBy) => (
                    <SelectItem key={groupBy.key}>
                      {groupBy.label}
                    </SelectItem>
                  )}
                </Select>
              )
            }
            <Popover
              placement="bottom-end"
              classNames={{ content: "p-[0.3rem]" }}
            >
              <PopoverTrigger>
                <Button isIconOnly radius="sm" className="h-full aspect-square">
                  <SlidersIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-[192px] flex flex-col gap-1">
                  <Select
                    label="Sexo"
                    selectedKeys={[selectedSex]}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSex(e.target.value)}
                    isDisabled={isFetching}
                    size="sm"
                    items={SEX_OPTIONS}
                    classNames={{
                      base: "w-full"
                    }}
                  >
                    {(sex) => (
                      <SelectItem key={sex.key}>
                        {sex.label}
                      </SelectItem>
                    )}
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-center items-center h-full">
          {
            isFetching &&
              <Spinner size="lg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          }
          <Line
            data={chartData}
            options={
              {
                responsive: true,
                plugins: {
                  legend: {
                    display: true
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            }
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default LineChart;
