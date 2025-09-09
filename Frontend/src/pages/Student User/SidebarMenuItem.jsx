import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Chip, Box } from '@mui/material';

/**
 * Reusable sidebar menu item.
 * Props:
 *  - icon: React element
 *  - label: string
 *  - selected: boolean
 *  - onClick: function
 *  - animation: keyframes reference
 *  - delay: seconds (number) for staggered animation
 *  - showChip: { label, color } optional status chip
 */
const SidebarMenuItem = ({ icon, label, selected, onClick, animation, delay = 0, showChip }) => {
  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        borderRadius: 1.5,
        mb: 1,
        transition: 'all 0.3s ease',
        backgroundColor: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
        animation: `${animation} ${0.3 + delay * 0.1}s ease-out`,
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'translateX(5px)'
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(255,255,255,0.15)'
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'rgba(255,255,255,0.25)'
        }
      }}
    >
      <ListItemIcon
        sx={{
          color: '#fff',
          minWidth: 40,
          transition: 'transform 0.2s ease',
          ...(selected && { transform: 'scale(1.2)' })
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }}
      />
      {showChip && (
        <Box sx={{ ml: 0.5 }}>
          <Chip size="small" label={showChip.label} color={showChip.color} sx={{ height: 20 }} />
        </Box>
      )}
    </ListItemButton>
  );
};

export default SidebarMenuItem;