use crate::{state::*, constants::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(bump: u8, to: Pubkey)]
pub struct MigrateV1ToV2Connection<'info> {
    #[account(
        init,
        payer = signer,
        space = ConnectionV2::calculate_space(),
        seeds = [CONNECTION_SEED_V2.as_ref(), from.key().as_ref(), to.as_ref()],
        bump,
    )]
    pub connection_v2: Account<'info, ConnectionV2>,
    #[account(
        mut,
        close = signer,
        seeds = [CONNECTION_SEED.as_ref(), from.key().as_ref(), to.as_ref()],
        bump = bump,
        constraint = from.key().as_ref() == connection.from.key().as_ref(),
    )]
    pub connection: Account<'info, Connection>,
    #[account(
        mut,
        constraint = from.key().as_ref() == connection.from.key().as_ref()
    )]
    pub from: SystemAccount<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// This is a permissionless call that allows anyone to close and open a new connection.
pub fn migrate_v1_to_v2_connection_instruction(ctx: Context<MigrateV1ToV2Connection>) -> Result<()> {
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    let connection_v2 = &mut ctx.accounts.connection_v2;
    connection_v2.from = connection.from;
    connection_v2.to = connection.to;
    connection_v2.connected_at = clock.unix_timestamp;
    connection_v2.disconnected_at = None;
    // At the end of the call, connection_v1 is closed and connection_v2 is open.
    Ok(())
}