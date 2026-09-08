import { PartialType } from '@nestjs/swagger';

import { CreateSectionDto } from './create-section.dto';

/**
 * Tous les champs deviennent optionnels. Le service applique la mise à jour
 * en fonction du `type` de la section (body / videoUrl / photos / quiz).
 */
export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
