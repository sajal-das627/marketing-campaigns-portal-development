// Import JSON from API and load into editor
import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { resetDocument } from '../../documents/editor/EditorContext';

export default function ImportJsonFromApiDialog({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJson = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/templates/680b67f38a05c9f155471c84');
        const data = await response.json();

        if (!data?.design) {
          setError('No valid design JSON found in response.');
          return;
        }

        resetDocument(data.design);
        onClose();
      } catch (err) {
        setError('Failed to load template JSON.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJson();
  }, [onClose]);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Import Template from API</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography>Template loaded successfully.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
