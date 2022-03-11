use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct RevokeConnection<'info> {
    #[account(
        mut,
        close = from,
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.as_ref()],
        bump = bump
    )]
    pub connection: Account<'info, Connection>,
    #[account(mut)]
    pub from: Signer<'info>,
}

pub fn revoke_connection_instruction(ctx: Context<RevokeConnection>) -> Result<()> {
    ctx.accounts.connection.log_revoke();
    Ok(())
}
