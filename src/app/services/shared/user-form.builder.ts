import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../../interfaces/user';

export function buildUserForm(fb: FormBuilder, initialData?: Partial<User>): FormGroup {
  const minTextCharSize = 3;
  const maxTextCharSize = 60;

  return fb.group({
    name: [initialData?.name ?? '', [Validators.required, Validators.minLength(minTextCharSize), Validators.maxLength(maxTextCharSize)]],
    email: [initialData?.email ?? '', [Validators.required, Validators.email]],
    cpf: [initialData?.cpf ?? '', []],
    birthDate: [initialData?.birthDate ?? '', [Validators.required]],
    numberType: [initialData?.numberType ?? '', [Validators.required]],
    number: [initialData?.number ?? '', [Validators.required, Validators.minLength(10)]],
    country: [initialData?.country ?? '', [Validators.required]],
    state: [{ value: initialData?.state ?? '', disabled: !initialData?.country }, [Validators.required]]
  });
}