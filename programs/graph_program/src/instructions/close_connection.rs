use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct CloseConnection<'info> {
    #[account(
        mut,
        close = from,
        seeds = [CONNECTION_SEED.as_ref(), from.key().as_ref(), to.as_ref()],
        bump = bump
    )]
    pub connection: Account<'info, Connection>,
    pub clock: Sysvar<'info, Clock>,
    #[account(
        mut,
        constraint = from.key().as_ref() == connection.from.key().as_ref()
    )]
    pub from: SystemAccount<'info>,
    #[account(mut)]
    pub signer: Signer<'info>, // Anyone can sign, permissionless call.
}

pub fn close_connection_instruction(ctx: Context<CloseConnection>) -> Result<()> {
    let connection = &mut ctx.accounts.connection;
    require!(
        connection.status == Some(ConnectionStatus::Disconnected),
        CloseConnectionError::AccountNeedsToBeDisconnected
    );
    connection.log_revoke();
    Ok(())
}

#[error_code]
pub enum CloseConnectionError {
    #[msg("Account needs to be disconnected first")]
    AccountNeedsToBeDisconnected,
}
