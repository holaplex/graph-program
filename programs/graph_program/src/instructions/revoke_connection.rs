use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct RevokeConnection<'info> {
    #[account(
        mut,
        seeds = [CONNECTION_SEED_V2.as_ref(), from.key().as_ref(), to.as_ref()],
        bump = bump,
        constraint = from.key().as_ref() == connection.from.key().as_ref(),
    )]
    pub connection: Account<'info, ConnectionV2>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn revoke_connection(ctx: Context<RevokeConnection>) -> Result<()> {
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    connection.disconnected_at = Some(clock.unix_timestamp);

    // Validate right disconnection time, someone
    // Can mess up account state by sending both a
    // make, and a revoke in the same block.
    let connected_at = connection.connected_at;
    let disconnected_at = connection.disconnected_at.unwrap(); // Safe to unwrap since we check the value is set.
    require!(
        disconnected_at > connected_at,
        RevokeConnectionError::ClockDateMustBeHigherThanConnectionDate
    );

    connection.log_revoke();
    Ok(())
}

#[error_code]
pub enum RevokeConnectionError {
    #[msg("Clock date must be higher than connection date. Retry in another block.")]
    ClockDateMustBeHigherThanConnectionDate,
}
