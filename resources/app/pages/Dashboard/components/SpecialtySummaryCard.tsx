import { Card, CardBody, Skeleton } from "@heroui/react";
import { FC } from "react";
import CustomProgress from "./CustomProgress";

interface SpecialtySummaryCardProps {
    generalSummary: SpecialtySummary[] | undefined;
    }

const SpecialtySummaryCard: FC<SpecialtySummaryCardProps> = ({ generalSummary }) =>
  (
    <Card classNames={{
      base: "!h-[108px]"
    }}>
      <CardBody>
        {
          generalSummary ? (
            <h2 className="text-lg font-semibold">Resumen por especialidad</h2>
          ) : (
            <Skeleton className="w-[220px] h-[20px] rounded-sm my-1" />
          )
        }
        <div className="grid grid-cols-[105px_auto] gap-1 items-center">
          {
            generalSummary ?
              generalSummary.length > 0 ?
                generalSummary.map((summary, index) => (
                  <CustomProgress
                    key={index}
                    value={summary.attended / summary.total * 100}
                    color={["success", "warning", "secondary"][index] as "success" | "warning" | "secondary"}
                    specialty={summary.specialty}
                  />
                ))
                : <p className="text-sm text-gray-500 col-span-2">No hay datos para mostrar</p>
              : <>
                <Skeleton className="w-full h-4 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-md" />
                <Skeleton className="w-full h-4 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-md" />
                <Skeleton className="w-full h-4 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-md" />
              </>
          }
        </div>
      </CardBody>
    </Card>
  );


export default SpecialtySummaryCard;
