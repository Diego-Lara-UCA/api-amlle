import { AgreementEntity } from 'src/models/agreement/entities/agreement.entity';
import { MinutesEntity } from '../entities/minute.entity';
import { MinutesType } from '../enums/minutes-status.enum';

type AttendanceItem = {
    propietarioId: string | null;
    propietarioName: string | null;
    attended: boolean;
    substituteId: string | null;
    substituteName: string | null;
};

type AgreementItem = {
    id: string;
    name: string;
    agreementNumber: number;
    createdAt: Date;
    createdByName: string | null;
    latestModifierName: string | null;
    latestModificationDate: Date | null;
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
    volumeId: string | null;
    volumeName: string | null;
    bookId: string | null;
    bookName: string | null;
    createdByName: string;
    latestModifierName: string | null;
    latestModificationDate: Date | null;
    agreementCount: number;
    attendanceList: AttendanceItem[];
    agreements: AgreementItem[];

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
                propietarioId: att.propietarioConvocado?.id || null,
                propietarioName: att.propietarioConvocado?.name || null,
                attended: att.asistioPropietario,
                substituteId: att.substitutoAsistente?.id || null,
                substituteName: att.substitutoAsistente?.name || null,
            }))
            : [];

        const agreementListDto: AgreementItem[] = minutes.agreements
            ? minutes.agreements.map((agreement: AgreementEntity) => {

                let agreementModDate: Date | null = null;
                let agreementModName: string | null = null;

                if (agreement.modifications && agreement.modifications.length > 0) {
                    const sortedAgreementMods = [...agreement.modifications].sort(
                        (a, b) => b.modificationDate.getTime() - a.modificationDate.getTime(),
                    );
                    const latestAgreementMod = sortedAgreementMods[0];
                    agreementModDate = latestAgreementMod.modificationDate;
                    if (latestAgreementMod.modifier) {
                        agreementModName = latestAgreementMod.modifier.nombre;
                    }
                }

                return {
                    id: agreement.id,
                    name: agreement.name,
                    agreementNumber: agreement.agreementNumber,
                    createdAt: agreement.createdAt,
                    createdByName: agreement.createdBy?.nombre || 'Usuario desconocido',
                    latestModifierName: agreementModName,
                    latestModificationDate: agreementModDate,
                };
            })
            : [];
        
        const volume = minutes.volume;
        const book = volume?.book;

        return {
            id: minutes.id,
            name: minutes.name,
            actNumber: minutes.actNumber,
            meetingDate: minutes.meetingDate,
            meetingTime: minutes.meetingTime,
            bodyContent: minutes.bodyContent,
            status: minutes.status,
            createdAt: minutes.createdAt,
            volumeId: volume?.id || null,
            volumeName: volume?.name || null,
            bookId: book?.id || null,
            bookName: book?.name || null,
            createdByName: minutes.createdBy?.nombre || 'Usuario desconocido',
            latestModifierName: latestModName,
            latestModificationDate: latestModDate,
            agreementCount: minutes.agreements ? minutes.agreements.length : 0,
            attendanceList: attendanceListDto,
            agreements: agreementListDto,
        };
    }
}