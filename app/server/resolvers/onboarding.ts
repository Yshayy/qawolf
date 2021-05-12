import { hasInvitedUser } from "../models/invite";
import { hasIntroGuide, hasTest } from "../models/test";
import { hasTrigger } from "../models/trigger";
import { Context, Onboarding, TeamIdQuery } from "../types";
import { ensureTeamAccess, ensureUser } from "./utils";

export const onboardingResolver = async (
  _: Record<string, unknown>,
  { team_id }: TeamIdQuery,
  { db, logger, teams, user: contextUser }: Context
): Promise<Onboarding> => {
  const log = logger.prefix("onboardingResolver");
  log.debug("user", contextUser?.id);

  const user = ensureUser({ logger, user: contextUser });
  ensureTeamAccess({ logger, team_id, teams });

  const options = { db, logger };

  return {
    has_completed_tutorial: await hasIntroGuide(user.id, options),
    has_created_test: await hasTest(team_id, options),
    has_invited_user: await hasInvitedUser(team_id, options),
    has_trigger: await hasTrigger(team_id, options),
  };
};
