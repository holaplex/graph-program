use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct RevokeConnection<'info> {
    #[account(
        mut,
        seeds = [CONNECTION_SEED.as_ref(), from.key().as_ref(), to.as_ref()],
        bump = bump,
        constraint = from.key().as_ref() == connection.from.key().as_ref(),
    )]
    pub connection: Account<'info, Connection>,
    pub clock: Sysvar<'info, Clock>,
    #[account(mut)]
    pub from: Signer<'info>,
}

pub fn revoke_connection_instruction(ctx: Context<RevokeConnection>) -> Result<()> {
    let connection = &mut ctx.accounts.connection;
    connection.disconnected_at = Some(ctx.accounts.clock.unix_timestamp);
    connection.status = Some(ConnectionStatus::Disconnected);
    connection.log_revoke();
    Ok(())
}
