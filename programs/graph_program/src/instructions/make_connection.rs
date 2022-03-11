use crate::{constants::CONNECTION_SEED, state::Connection};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(to: Pubkey)]
pub struct MakeConnection<'info> {
    #[account(
        init,
        payer = from,
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.as_ref()],
        bump,
    )]
    pub connection: Account<'info, Connection>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn make_connection_instruction(ctx: Context<MakeConnection>, to: Pubkey) -> Result<()> {
    let connection = &mut ctx.accounts.connection;
    connection.from = ctx.accounts.from.key();
    connection.to = to;
    connection.log_make();
    Ok(())
}
