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
        connection.disconnected_at.is_some(),
        CloseConnectionError::AccountNeedsToBeDisconnected
    );
    // If connected_at is not set, let's assume beginning of time as it is logically in absolute past (0).
    let connected_at = match connection.connected_at {
        Some(connected_at) => connected_at,
        None => 0i64,
    };
    let disconnected_at = connection.disconnected_at.unwrap(); // Safe to unwrap since we check the value is set.
    require!(
        disconnected_at > connected_at,
        CloseConnectionError::DisconnectionDateMustBeHigherThanConnectionDate
    );
    connection.log_revoke();
    Ok(())
}

#[error_code]
pub enum CloseConnectionError {
    #[msg("Account needs to be disconnected first")]
    AccountNeedsToBeDisconnected,
    #[msg("Disconnection date must be higher than connection date")]
    DisconnectionDateMustBeHigherThanConnectionDate,
}
