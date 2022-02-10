use crate::{constants::*, state::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(to: Pubkey)]
pub struct MakeConnection<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(
        init,
        payer = from,
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.as_ref()],
        has_one = from,
        bump,
    )]
    pub connection: Account<'info, Connection>,
    pub system_program: Program<'info, System>,
}

pub fn make_connection_instruction(ctx: Context<MakeConnection>, to: Pubkey) -> ProgramResult {
    let connection = &mut ctx.accounts.connection;
    connection.from = ctx.accounts.from.key();
    connection.to = to;
    connection.log_make();
    Ok(())
}
