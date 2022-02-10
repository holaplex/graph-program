use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(connection_bump: u8, to: Pubkey)]
pub struct RevokeConnection<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(
        mut,
        close = from,
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.as_ref()],
        has_one = from,
        bump = connection_bump
    )]
    pub connection: Account<'info, Connection>,
}

pub fn revoke_connection_instruction(ctx: Context<RevokeConnection>) -> ProgramResult {
    ctx.accounts.connection.log_revoke();
    Ok(())
}
