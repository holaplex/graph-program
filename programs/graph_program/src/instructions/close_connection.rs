use crate::{constants::*, state::*, errors::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct CloseConnection<'info> {
    #[account(
        mut,
        close = from,
        seeds = [CONNECTION_SEED_V2.as_ref(), from.key().as_ref(), to.as_ref()],
        bump = bump
    )]
    pub connection: Account<'info, ConnectionV2>,
    #[account(
        mut,
        constraint = from.key().as_ref() == connection.from.key().as_ref()
    )]
    pub from: SystemAccount<'info>,
    #[account(mut)]
    pub signer: Signer<'info>, // Anyone can sign, permissionless call.
}

pub fn close_connection(ctx: Context<CloseConnection>) -> Result<()> {
    let connection = &mut ctx.accounts.connection;
    require!(
        connection.disconnected_at.is_some(),
        GraphError::AccountNeedsToBeDisconnected
    );
    // If connected_at is not set, let's assume beginning of time as it is logically in absolute past (0).
    let connected_at = connection.connected_at;
    let disconnected_at = connection.disconnected_at.unwrap(); // Safe to unwrap since we check the value is set.
    require!(
        disconnected_at > connected_at,
        GraphError::DisconnectionDateMustBeHigherThanConnectionDate
    );
    connection.log_close();
    Ok(())
}
