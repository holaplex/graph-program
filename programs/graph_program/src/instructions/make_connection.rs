use crate::{constants::*, state::ConnectionV2};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(to: Pubkey)]
pub struct MakeConnection<'info> {
    #[account(
        init_if_needed,
        payer = from,
        space = ConnectionV2::calculate_space(),
        seeds = [CONNECTION_SEED_V2.as_ref(), from.key().as_ref(), to.as_ref()],
        bump,
    )]
    pub connection: Account<'info, ConnectionV2>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn make_connection(ctx: Context<MakeConnection>, to: Pubkey) -> Result<()> {
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    connection.set_inner(ConnectionV2 {
        from: ctx.accounts.from.key(),
        to,
        connected_at: clock.unix_timestamp,
        disconnected_at: None,
    });
    connection.log_make();
    Ok(())
}
