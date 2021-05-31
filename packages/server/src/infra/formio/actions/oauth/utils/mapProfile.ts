import {getValue, setValue} from "@tsed/core";
import {FormioSubmission} from "@tsed/formio";

export interface Profile {
  id: string;
  email: string;
  login: string;
  name: string;
}

export function mapProfile(profile: Profile, accessToken: string, settings: any): FormioSubmission<Profile> {
  const user: any = Object.entries(settings).reduce(
    (user, [key, value]) => {
      if (key === "role") {
        user.roles.push(value as string);
      }

      if (key.startsWith("autofill-") && value) {
        const field = getValue(profile, key.replace(`autofill-${settings.provider}-`, ""));
        setValue(user, `data.${value}`, field);
      }

      return user;
    },
    {
      form: settings.resource,
      roles: [] as string[],
      externalIds: [] as any[],
      data: {}
    }
  );

  user.externalIds.push({
    id: profile.id,
    type: settings.provider,
    accessToken: accessToken
  });

  return user;
}
