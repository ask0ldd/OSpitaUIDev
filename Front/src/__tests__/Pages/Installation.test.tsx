/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {expect, test, describe, beforeEach, vi } from 'vitest';
import '@testing-library/react/dont-cleanup-after-each'
import Installation from '../../pages/Installation';
import { OllamaService } from '../../services/OllamaService'
import { fireEvent } from '@testing-library/dom'
import mockModelsList from '../../__mocks__/mockModelsList';
import mockAgentsList from '../../__mocks__/mockAgentsList';
import AgentService from '../../services/API/AgentService';

const mockedUsedNavigate = vi.fn()

const MockedRouter = () => (
    <MemoryRouter>
      <Installation />
    </MemoryRouter>
)

describe('Given I am on the Configuration page', () => {

    beforeEach(() => {
        vi.spyOn(OllamaService, 'getModelList').mockResolvedValue(mockModelsList)
        vi.spyOn(AgentService.prototype, 'updateAgentsConfig').mockResolvedValueOnce()
        vi.spyOn(AgentService.prototype, 'getAll').mockResolvedValue(mockAgentsList)
        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom')
            return {
              ...actual,
              useNavigate: () => mockedUsedNavigate,
            };
        })
          
        render(<MockedRouter />)
    })

    test('Step 1 should be visible by default', async () => {
        await waitFor(() => expect(screen.getByText(/Welcome to OSSPITA/i)).toBeInTheDocument())
        expect(screen.getByText(/skip/i)).toBeInTheDocument()
        expect(screen.getByText(/next/i)).toBeInTheDocument()
        const allButtons = screen.queryAllByRole("button")
        expect(allButtons).toHaveLength(2)
    })

    describe('When I click on the "next" button while being on Step 1', () => {
        test('I should be redirected to the 2nd Step of the config process', async () => {
            // screen.debug()
            expect(screen.getByText(/Welcome to OSSPITA/i)).toBeInTheDocument()
            expect(screen.queryByText(/Step 2 on 4/i)).not.toBeInTheDocument()
            const nextButton : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButton.click())
            await waitFor(() => expect(screen.getByText(/Step 2 on 4/i)).toBeInTheDocument())
        })
    })

    describe('When I click on the "next" button while being on Step 2', () => {
        test('Page 3 should be displayed', async () => {
            expect(screen.getByText(/Welcome to OSSPITA/i)).toBeInTheDocument()
            const nextButtonP2 : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButtonP2.click())
            await waitFor(() => expect(screen.getByText(/Step 2 on 4/i)).toBeInTheDocument())
            const nextButtonP3 : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButtonP3.click())
            await waitFor(() => expect(screen.getByText(/Step 3 on 4/i)).toBeInTheDocument())
        })
    })

    describe('When I am on Step 3', () => {
        test('I should be able to select the models I need and it should have an effect on step 4', async () => {
            expect(screen.getByText(/Welcome to OSSPITA/i)).toBeInTheDocument()
            const nextButtonP2 : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButtonP2.click())
            await waitFor(() => expect(screen.getByText(/Step 2 on 4/i)).toBeInTheDocument())
            const nextButtonP3 : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButtonP3.click())
            await waitFor(() => expect(screen.getByText(/Step 3 on 4/i)).toBeInTheDocument())

            // check clicking on row 1 action
            const row1 = screen.getByText(/4GB/i).parentElement;
            expect(row1).toBeDefined()
            expect(screen.getByText(/> ollama pull aya-expanse:8b/i)).toBeInTheDocument()
            if (row1) act(() => row1.click())

            // always use queryByText with not.toBeInTheDocument()
            // The method getByText is designed to throw an error if the element is not found. This means that if the text is present in the document, 
            // the assertion will pass. However, if it is not found, it will throw an error before reaching the not.toBeInTheDocument() assertion, 
            // causing your test to fail prematurely. Instead, you should use queryByText, which returns null if the element is not found, 
            // allowing you to assert its absence without throwing an error first
            await waitFor(() => expect(screen.queryByText(/> ollama pull aya-expanse:8b/i)).not.toBeInTheDocument())
            
            // check clicking on row 2 action
            const row2 = screen.getByText(/8GB/i).parentElement;
            expect(row2).toBeDefined()
            expect(screen.queryByText(/> ollama pull aya-expanse:8b/i)).not.toBeInTheDocument()
            if (row2) act(() => row2.click())
            await waitFor(() => expect(screen.getByText(/> ollama pull aya-expanse:8b/i)).toBeInTheDocument())

            // check clicking on row 3 action
            const row3 = screen.getByText(/12GB/i).parentElement;
            expect(row3).toBeDefined()
            expect(screen.queryByText(/> ollama pull mistral-nemo/i)).not.toBeInTheDocument()
            if (row3) act(() => row3.click())
            await waitFor(() => expect(screen.getByText(/> ollama pull mistral-nemo/i)).toBeInTheDocument())

            const nextButtonP4 : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent == "next")[0]
            act(() => nextButtonP4.click())

            // mistral-nemo:12b should be selected by default as the complex model
            const select1 : HTMLElement = screen.getAllByRole("combobox")[0]
            expect(select1).toBeDefined()
            expect(select1.textContent).toBe("mistral-nemo:12b")
            act(() => fireEvent.mouseDown(select1))
            await waitFor(() => expect(screen.getAllByRole("listbox")).toHaveLength(1))

            // 6 models listed in the select
            const listBox1 : HTMLElement = screen.getAllByRole("listbox")[0]
            expect(listBox1).toBeDefined()
            expect(listBox1.children.length).toEqual(6)

            // select aya-expanse:8b
            act(() => fireEvent.mouseDown(listBox1.children[0]))

            // llama3.2:3b should be selected by default as the basic model
            const select2 : HTMLElement = screen.getAllByRole("combobox")[1]
            expect(select2).toBeDefined()
            expect(select2.textContent).toBe("llama3.2:3b")
            act(() => fireEvent.mouseDown(select2))
            await waitFor(() => expect(screen.getAllByRole("listbox")).toHaveLength(1))

            // 6 models listed in the select
            const listBox2 : HTMLElement = screen.getAllByRole("listbox")[0]
            expect(listBox2).toBeDefined()
            expect(listBox2.children.length).toEqual(6)

            // select llama3.2:1b
            act(() => fireEvent.mouseDown(listBox2.children[1]))

            // save button
            const saveButton : HTMLElement = screen.queryAllByRole("button").filter(button => button.textContent  == "Save")[0]
            expect(saveButton).toBeDefined()
            act(() => saveButton.click())
            await waitFor(() => expect(AgentService.prototype.updateAgentsConfig).toHaveBeenCalledWith({advancedModel : "aya-expanse:8b", basicModel : "llama3.2:1b", embeddingModel : "nomic-embed-text:v1.5"}))
        })
    })

    test('Step 1 should give me the option to be redirected to the chat', async () => {
        await waitFor(() => expect(screen.getByText(/Welcome to OSSPITA/i)).toBeInTheDocument())
        expect(screen.getByText(/skip/i)).toBeInTheDocument()
        const skipButton : HTMLElement = screen.getByText(/skip/i)
        expect(skipButton).toBeDefined()
        act(() => skipButton.click())
        // await waitFor(() => expect(screen.getByText(/OSSPITA FOR/i)).toBeInTheDocument())
        await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith("/chat"))
    })
})