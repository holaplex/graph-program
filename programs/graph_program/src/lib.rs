use anchor_lang::prelude::*;

declare_id!("grphAFGNvCjLKHeEmPNa91eGJChcUhrdaYYharcZCTQ");

#[program]
pub mod graph_program {
    use super::*;

    pub fn create_connections_storage(ctx: Context<CreateConnectionsStorage>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        let storage_bump = ctx.bumps["storage"];
        storage.bump = storage_bump;
        storage.connections = vec![];
        Ok(())
    }

    pub fn create_connection(ctx: Context<CreateConnection>, to: Pubkey) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        // TODO: Use HashSet instead of Vec when it's properly supported by anchor.
        // TODO: or use a different client without touching Anchor's IDL
        let position = storage.connections.iter().position(|f| f == &to);
        require!(position.is_none(), GraphError::ConnectionAlreadyExists);
        storage.connections.push(to);
        Ok(())
    }

    pub fn remove_connection(ctx: Context<CreateConnection>, to: Pubkey) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        // TODO: Use HashSet instead of Vec when it's properly supported by anchor.
        // TODO: or use a different client without touching Anchor's IDL
        let position = storage.connections.iter().position(|f| f == &to);
        require!(position.is_some(), GraphError::ConnectionNotFound);
        storage.connections.remove(position.unwrap());
        Ok(())
    }

    // TODO: Add bulk operations
}

#[account]
pub struct ConnectionsStorage {
    pub connections: Vec<Pubkey>,
    pub bump: u8,
}

impl ConnectionsStorage {
    pub fn size(length: usize) -> usize {
        8 + // Discriminator
        1 + // Bump
        4 + 32 * length // Connections Vec/HashSet
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
