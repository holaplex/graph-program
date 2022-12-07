use std::collections::HashSet;

use anchor_lang::prelude::*;

declare_id!("grphAFGNvCjLKHeEmPNa91eGJChcUhrdaYYharcZCTQ");

#[program]
pub mod graph_program {
    use super::*;

    pub fn create_connections_storage(ctx: Context<CreateConnectionsStorage>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        let storage_bump = ctx.bumps["storage"];
        storage.bump = storage_bump;
        storage.connections = HashSet::new();
        Ok(())
    }

    pub fn create_connection(ctx: Context<CreateConnection>, to: Pubkey) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        let was_present = storage.connections.insert(to);
        require!(!was_present, GraphError::ConnectionAlreadyExists);
        Ok(())
    }

    pub fn remove_connection(ctx: Context<CreateConnection>, to: Pubkey) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        let was_present = storage.connections.remove(&to);
        require!(was_present, GraphError::ConnectionNotFound);
        Ok(())
    }

    // TODO: Add bulk operations
}

#[account]
pub struct ConnectionsStorage {
    pub connections: HashSet<Pubkey>,
    pub bump: u8,
}

impl ConnectionsStorage {
    pub fn size(length: usize) -> usize {
        8 + // Discriminator
        1 + // Bump
        4 + 32 * length // Connections HashSet
    }
}

#[derive(Accounts)]
pub struct CreateConnectionsStorage<'info> {
    #[account(
        init,
        payer = signer,
        seeds = [b"connections".as_ref(), signer.key.as_ref()],
        bump,
        space = ConnectionsStorage::size(0)
    )]
    pub storage: Account<'info, ConnectionsStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateConnection<'info> {
    #[account(
        mut,
        seeds = [b"connections".as_ref(), signer.key.as_ref()],
        bump = storage.bump,
        realloc = ConnectionsStorage::size(storage.connections.len() + 1),
        realloc::payer = signer,
        realloc::zero = false,
    )]
    pub storage: Account<'info, ConnectionsStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveConnection<'info> {
    #[account(
        mut,
        seeds = [b"connections".as_ref(), signer.key.as_ref()],
        bump = storage.bump,
        realloc = ConnectionsStorage::size(storage.connections.len() - 1),
        realloc::payer = signer,
        realloc::zero = false,
    )]
    pub storage: Account<'info, ConnectionsStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum GraphError {
    #[msg("Connection not found")]
    ConnectionNotFound,
    #[msg("Connection already exists")]
    ConnectionAlreadyExists,
}
