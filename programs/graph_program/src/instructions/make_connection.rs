use crate::{state::{Connection}, constants::*};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(to: Pubkey)]
pub struct MakeConnection<'info> {
    #[account(
        // It is safe to init if neeeded (overwrite existing account [or reinitialize])
        // because we need this behavior so if anyone revoked the connection but
        // they didn't close the account they can still reconnect.
        init_if_needed,
        payer = from,
        space = Connection::calculate_space(),
        seeds = [CONNECTION_SEED.as_ref(), from.key().as_ref(), to.as_ref()],
        bump,
    )]
    pub connection: Account<'info, Connection>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn make_connection_instruction(ctx: Context<MakeConnection>, to: Pubkey) -> Result<()> {
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    connection.from = ctx.accounts.from.key();
    connection.to = to;
    connection.connected_at = Some(clock.unix_timestamp);
    connection.log_make();
    Ok(())
}
