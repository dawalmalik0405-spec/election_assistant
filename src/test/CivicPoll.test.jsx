import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CivicPoll from '../components/CivicPoll';
import React from 'react';

describe('CivicPoll Component', () => {
  it('renders the poll question and options', () => {
    render(<CivicPoll />);
    expect(screen.getByText(/Which civic issue should be the focus/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital Voting Security/i)).toBeInTheDocument();
  });

  it('allows a user to vote and shows results', () => {
    render(<CivicPoll />);
    
    // Find the first option and click it
    const optionButton = screen.getByText(/Digital Voting Security/i).closest('button');
    fireEvent.click(optionButton);

    // Should show results and confirmation message
    expect(screen.getByText(/Your voice has been recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/45%/i)).toBeInTheDocument();
  });

  it('disables buttons after voting', () => {
    render(<CivicPoll />);
    
    const optionButton = screen.getByText(/Digital Voting Security/i).closest('button');
    fireEvent.click(optionButton);

    // All buttons should now be disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });
});
