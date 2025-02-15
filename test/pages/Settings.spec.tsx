import { h } from 'preact';
import { fireEvent, render, screen } from '@testing-library/preact';

import Settings from '../../src/pages/Settings';

jest.mock('../../src/store', () =>
	jest.fn().mockReturnValue({
		error: {},
		resetErrors: () => void 0,
		user: {
			username: 'SmokeTest',
			email: 'smoketest@example.com',
			bio: 'Foo Bar Baz',
			image: 'https://static.productionready.io/images/smiley-cyrus.jpg'
		},
	})
);

describe('Settings Page Renders', () => {
	it('renders the Settings page', () => {
		render(<Settings />);
		expect(screen.getByRole('heading', { name: 'Your Settings' })).toBeInTheDocument();
	});

	it('renders input fields', () => {
		render(<Settings />);
		expect(screen.getByRole('textbox', { name: 'URL of profile picture' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Short bio about you' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
		// input[type="password"] doesn't actually have an implicit role,
		// so the test has to be a bit different. See:
		// https://github.com/testing-library/dom-testing-library/issues/567
		expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
	});

	it('renders a (disabled) submit button', () => {
		render(<Settings />);
		const submitButton = screen.getByRole('button', { name: 'Update Settings' });
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeDisabled();
	});

	it('preloads inputs with current user data', () => {
		render(<Settings />);

		expect(screen.getByRole('textbox', { name: 'URL of profile picture' })).toHaveValue(
			'https://static.productionready.io/images/smiley-cyrus.jpg'
		);
		expect(screen.getByRole('textbox', { name: 'Username' })).toHaveValue('SmokeTest');
		expect(screen.getByRole('textbox', { name: 'Short bio about you' })).toHaveValue('Foo Bar Baz');
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('smoketest@example.com');
	});
});

describe('Settings Form Behavior', () => {
	it('validates profile picture input', () => {
		render(<Settings />);
		const profilePicture = screen.getByRole('textbox', { name: 'URL of profile picture' });

		fireEvent.input(profilePicture, { target: { value: 'smoketest' } });
		expect(profilePicture).toBeInvalid();

		fireEvent.input(profilePicture, { target: { value: 'http://example.com/picture.jpg' } });
		expect(profilePicture).toBeValid();
	});

	it('validates email input', () => {
		render(<Settings />);
		const email = screen.getByRole('textbox', { name: 'Email' });

		fireEvent.input(email, { target: { value: 'smoketest' } });
		expect(email).toBeInvalid();

		fireEvent.input(email, { target: { value: 'smoketest@example.com' } });
		expect(email).toBeValid();
	});

	it('validates password input', () => {
		render(<Settings />);
		const password = screen.getByPlaceholderText('New Password');

		fireEvent.input(password, { target: { value: 'foobar' } });
		expect(password).toBeInvalid();

		fireEvent.input(password, { target: { value: 'foobarbaz' } });
		expect(password).toBeValid();
	});

	it('ensures changed field is required to enable submit button', () => {
		render(<Settings />);

		fireEvent.input(screen.getByRole('textbox', { name: 'Email' }), {
			target: { value: 'smoketest@example.com' }
		});
		expect(screen.getByRole('button', { name: 'Update Settings' })).toBeDisabled();
	});

	it('ensures all fields are required to submit', () => {
		render(<Settings />);
		const submitButton = screen.getByRole('button', { name: 'Update Settings' });
		expect(submitButton).toBeDisabled();

		fireEvent.input(screen.getByRole('textbox', { name: 'Email' }), {
			target: { value: 'smoketest@example.com' }
		});
		expect(submitButton).toBeDisabled();

		fireEvent.input(screen.getByPlaceholderText('New Password'), {
			target: { value: 'foobarbaz' }
		});
		expect(submitButton).toBeEnabled();
	});
});
