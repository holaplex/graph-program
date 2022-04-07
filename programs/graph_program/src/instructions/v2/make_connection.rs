use crate::{state::{ConnectionV2}, constants::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(to: Pubkey)]
pub struct MakeConnectionV2<'info> {
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

pub fn make_connection_instruction_v2(ctx: Context<MakeConnectionV2>, to: Pubkey) -> Result<()> {
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    connection.from = ctx.accounts.from.key();
    connection.to = to;
    connection.connected_at = clock.unix_timestamp;
    connection.disconnected_at = None;
    connection.log_make();
    Ok(())
}
