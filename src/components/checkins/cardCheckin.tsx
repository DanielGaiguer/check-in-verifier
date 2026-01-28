import { TodayCheckinResponse } from "@/types/checkin";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { AlertCircle, ChevronRightIcon, CircleCheckIcon } from "lucide-react";

interface CardCheckinProps {
  checkins: TodayCheckinResponse[]
}

const CardCheckin = ({checkins}: CardCheckinProps) => {
	return (
		<div className="flex w-[90%] flex-col items-center">
          {checkins.map(({ checkins, users }) => (
            <div key={checkins.id} className="mb-1 flex w-full flex-col">
              <div className="w-[90%] self-center">
                <Badge variant="ghost" className="w-fit">
                  {checkins.date}
                </Badge>
              </div>
              <div className="flex justify-center gap-6 border-b">
                <Item
                  asChild
                  className={`w-[90%] rounded-md border transition-colors ${
                    checkins.overallStatus
                      ? 'border-green-400 bg-green-50 hover:border-green-600 hover:bg-green-100'
                      : 'border-red-400 bg-red-50 hover:border-red-600 hover:bg-red-100'
                  }`}
                >
                  <Link href="#">
                    <ItemMedia>
                      {checkins.overallStatus ? (
                        <CircleCheckIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Check-in feito por {users.name}</ItemTitle>
                      <ItemDescription>
                        Toque aqui para conferir informações do check-in
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRightIcon className="size-4" />
                    </ItemActions>
                  </Link>
                </Item>
              </div>
            </div>
          ))}
        </div>
	);
}
 
export default CardCheckin;