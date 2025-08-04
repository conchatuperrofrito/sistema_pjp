import { FC, useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Spinner
} from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSummaryByPeriod } from "@/services/dashboardService";
import { SlidersIcon } from "@/assets/icons";

ChartJS.register(Tooltip, Legend, ArcElement);

const TIME_PERIOD_OPTIONS = [
  { key: "today", label: "último día" },
  { key: "week", label: "última semana" },
  { key: "month", label: "último mes" },
  { key: "year", label: "último año" }
];

const SEX_OPTIONS = [
  { key: "", label: "Todos" },
  { key: "Masculino", label: "Masculino" },
  { key: "Femenino", label: "Femenino" },
  { key: "Unassigned", label: "Sin asignar" }
];

const GROUP_BY_OPTIONS = [
  { key: "specialty", label: "Especialidad" },
  { key: "status", label: "Estado" }
];

interface DoughnutChartProps {
  isAdmin: boolean;
}

const DoughnutChart: FC<DoughnutChartProps> = ({ isAdmin }) => {
  const [timePeriod, setTimePeriod] = useState("today");
  const [selectedSex, setSelectedSex] = useState("");
  const [groupBy, setGroupBy] = useState(isAdmin ? "specialty" : "status");

  const { data, isFetching, isLoading } = useQuery({
    queryKey: [
      "summaryByPeriod",
      timePeriod,
      selectedSex,
      groupBy
    ],
    queryFn: () =>
      getSummaryByPeriod({
        period: timePeriod,
        sex: selectedSex,
        groupBy: groupBy
      }),
    placeholderData: keepPreviousData
  });

  const colors = useMemo(() => {
    if (isAdmin && groupBy === "specialty") {
      return data?.map((_, idx) => `hsl(${(idx * 60) % 360}, 70%, 50%)`) || [];
    }
    const statusColors = {
      Cancelada: "hsl(0, 70%, 50%)",
      Pendiente: "hsl(60, 70%, 50%)",
      Realizada: "hsl(120, 70%, 50%)",
      Programada: "hsl(180, 70%, 50%)"
    };
    return data?.map((item) => statusColors[item.label as keyof typeof statusColors]) || [];
  }, [data, isAdmin, groupBy]);

  const chartData = useMemo(
    () => ({
      labels: data?.map((item) => item.label) || [],
      datasets: [
        {
          label: "Total de Citas",
          data: data?.map((item) => item.totalAppointments) || [],
          backgroundColor: colors
        }
      ]
    }),
    [data, colors]
  );

  const hasData = chartData.datasets[0].data.some((num) => num > 0);

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between flex-col sm:flex-row gap-y-1 mb-1">
          <h2 className="text-lg font-semibold">
            {isAdmin ? "Distribución de citas por periodo" : "Distribución de citas por estado"}
          </h2>
          <div className="flex items-center justify-end">
            <Select
              label="Periodo"
              selectedKeys={[timePeriod]}
              onChange={(e) => setTimePeriod(e.target.value || timePeriod)}
              isLoading={isFetching}
              size="sm"
              className="mr-1 w-[150px]"
            >
              {TIME_PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>

            <Popover
              placement="bottom-end"
              classNames={{ content: "p-[0.3rem]" }}
            >
              <PopoverTrigger>
                <Button isIconOnly radius="sm" className="h-[48px] aspect-square">
                  <SlidersIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-[192px] flex flex-col gap-1">
                  {
                    isAdmin && (
                      <Select
                        label="Agrupar por"
                        selectedKeys={[groupBy]}
                        onChange={(e) => setGroupBy(e.target.value)}
                        isDisabled={isFetching}
                        size="sm"
                        items={GROUP_BY_OPTIONS}
                      >
                        {(groupBy) => (
                          <SelectItem key={groupBy.key}>{groupBy.label}</SelectItem>
                        )}
                      </Select>
                    )
                  }
                  <Select
                    label="Sexo"
                    selectedKeys={[selectedSex]}
                    onChange={(e) => setSelectedSex(e.target.value)}
                    isDisabled={isFetching}
                    size="sm"
                    className="w-full"
                  >
                    {SEX_OPTIONS.map((sex) => (
                      <SelectItem key={sex.key}>{sex.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-center items-center h-full">
          {isFetching && <Spinner size="lg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
          {
            !isLoading &&(
              hasData ? (
                <Doughnut
                  data={chartData}
                  options={
                    {
                      responsive: true,
                      plugins: { legend: { display: true, position: "bottom" as const } }
                    }
                  } />
              ) : (
                <p className="text-gray-500">No hay datos para mostrar</p>
              ))
          }
        </div>
      </CardBody>
    </Card>
  );
};

export default DoughnutChart;
