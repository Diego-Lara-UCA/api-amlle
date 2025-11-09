import { MinutesEntity } from '../entities/minute.entity';
import { MinutesType } from '../enums/minutes-status.enum';

type AttendanceItem = {
    secretary: string;
    syndic: string;
    propietarioId: string;
    propietarioName: string;
    attended: boolean;
    substituteId: string | null;
    substituteName: string | null;
};

export class GetMinutesResponseDto {
    id: string;
    name: string;
    actNumber: number;
    meetingDate: Date;
    meetingTime: string;
    status: MinutesType;
    bodyContent: string;
    createdAt: Date;
    volumeId: string;
    volumeName: string;
    createdByName: string;
    latestModifierName: string | null;
    latestModificationDate: Date | null;
    agreementCount: number;
    attendanceList: AttendanceItem[];

    public static fromEntity(minutes: MinutesEntity): GetMinutesResponseDto {
        let latestModDate: Date | null = null;
        let latestModName: string | null = null;

        if (minutes.modifications && minutes.modifications.length > 0) {
            const sortedMods = [...minutes.modifications].sort(
                (a, b) => b.modificationDate.getTime() - a.modificationDate.getTime(),
            );

            const latestMod = sortedMods[0];
            latestModDate = latestMod.modificationDate;

            if (latestMod.modifier) {
                latestModName = latestMod.modifier.nombre;
            }
        }

        const attendanceListDto: AttendanceItem[] = minutes.attendanceList
            ? minutes.attendanceList.map((att) => ({
                secretary: att.secretary,
                syndic: att.syndic,
                propietarioId: att.propietarioConvocado?.id,
                propietarioName: att.propietarioConvocado?.name,
                attended: att.asistioPropietario,
                substituteId: att.substitutoAsistente?.id || null,
                substituteName: att.substitutoAsistente?.name || null,
            }))
            : [];

        return {
            id: minutes.id,
            name: minutes.name,
            actNumber: minutes.actNumber,
            meetingDate: minutes.meetingDate,
            meetingTime: minutes.meetingTime,
            bodyContent: minutes.bodyContent,
            status: minutes.status,
            createdAt: minutes.createdAt,
            volumeId: minutes.volume?.id,
            volumeName: minutes.volume?.name,
            createdByName: minutes.createdBy?.nombre || 'Usuario desconocido',
            latestModifierName: latestModName,
            latestModificationDate: latestModDate,
            agreementCount: minutes.agreements ? minutes.agreements.length : 0,
            attendanceList: attendanceListDto,
        };
    }
}